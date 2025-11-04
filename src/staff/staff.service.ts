import { BadRequestException, Injectable } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { DataSource, EntityManager } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateTeacherDto } from 'src/teacher/dto/create-teacher.dto';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { CreateBranchManagerDto } from 'src/branch-manager/dto/create-branch-manager.dto';
import { BranchManager } from 'src/branch-manager/entities/branch-manager.entity';
import { Branch } from 'src/branch/entities/branch.entity';

@Injectable()
export class StaffService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
    ) {}

    async create(createStaffDto: CreateStaffDto) {
        const user = await this.userService.findByEmail(createStaffDto.email);
        if (user) {
            throw new BadRequestException('Email already in use');
        }

        return await this.dataSource.transaction(async (manager) => {
            const user = await this.userService.createUserFromExtendedDto(createStaffDto, 'staff', manager);
            
            const staff = manager.create(Staff, {
                user: user,
                basicSalary: createStaffDto.basicSalary,
            });

            const savedStaff = await manager.save(Staff, staff);

            switch (createStaffDto.staffType) {
                case 'teacher':
                    await this.createTeacher(createStaffDto, savedStaff, manager);
                    break;
                case 'branch_manager':
                    await this.createBranchManager(createStaffDto, savedStaff, manager);
                    break;
                default:
                    break;
            }

            await manager.getRepository('users').update(user.id, {
                userTypeId: savedStaff.id,
            });

            const staffWithRelations = await manager.findOne(Staff, {
                where: { id: savedStaff.id },
                relations: ['user', 'teacher', 'branchManager', 'branchManager.branch'],
            });

            if (staffWithRelations?.user) {
                staffWithRelations.user.staff = staffWithRelations;
            }

            return staffWithRelations;
        });
    }

    private async createTeacher(createStaffDto: CreateStaffDto, staff: Staff, manager: EntityManager) {
        const createTeacherDto: CreateTeacherDto = {
            major: createStaffDto.major,
            academic_title: createStaffDto.academic_title,
            degree: createStaffDto.degree,
            staff: staff
        };

        const teacher = manager.create(Teacher, createTeacherDto);

        await manager.save(Teacher, teacher);
    }

    private async createBranchManager(createStaffDto: CreateStaffDto, staff: Staff, manager: EntityManager) {
        const branch = await manager.findOne(Branch, { where: { id: createStaffDto.branchId } });
        if (!branch) {
            throw new BadRequestException('Branch does not exist');
        }
        const createBranchManagerDto: CreateBranchManagerDto = {
            staff: staff,
            branch: branch,
        };
        const bm = manager.create(BranchManager, createBranchManagerDto);

        await manager.save(BranchManager, bm);
    }
}
