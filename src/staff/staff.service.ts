import { Injectable } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { DataSource, EntityManager } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { CreateTeacherDto } from 'src/teacher/dto/create-teacher.dto';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@Injectable()
export class StaffService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
        private readonly teacherService: TeacherService,
    ) {}

    async create(createStaffDto: CreateStaffDto) {
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
                default:
                    break;
            }

            await manager.getRepository('users').update(user.id, {
                userTypeId: savedStaff.id,
            });

            const staffWithRelations = await manager.findOne(Staff, {
                where: { id: savedStaff.id },
                relations: ['user', 'teacher'],
            });

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

        this.teacherService.create(createTeacherDto, manager);
        await manager.save(Teacher, createTeacherDto);
    }
}
