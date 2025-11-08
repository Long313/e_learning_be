import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { DataSource, EntityManager } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateTeacherDto } from 'src/teacher/dto/create-teacher.dto';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { CreateBranchManagerDto } from 'src/branch-manager/dto/create-branch-manager.dto';
import { BranchManager } from 'src/branch-manager/entities/branch-manager.entity';
import { Branch } from 'src/branch/entities/branch.entity';
import { Course } from 'src/course/entities/course.entity';
import { StudentManagement } from 'src/student-management/entities/student-management.entity';

@Injectable()
export class StaffService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
    ) {}

    async create(createStaffDto: CreateStaffDto) {
        let branch: Branch | null = null;
        if (createStaffDto.branchId) {
            branch = await this.dataSource.getRepository(Branch).findOne({
                where: { id: createStaffDto.branchId },
            }) as Branch;
            if (!branch) {
                throw new NotFoundException('Branch not found');
            }
        }

        let course: Course | null = null;
        if (createStaffDto.courseId) {
            course = await this.dataSource.getRepository(Course).findOne({
                where: { id: createStaffDto.courseId },
            }) as Course;
            if (!course) {
                throw new NotFoundException('Course not found');
            }
        }

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
                    await this.createTeacher(createStaffDto, savedStaff, manager, course as Course, branch as Branch);
                    break;
                case 'branch_manager':
                    await this.createBranchManager(savedStaff, manager, branch as Branch);
                    break;
                case 'student_management':
                    await this.createStudentManagement(savedStaff, manager, branch as Branch);
                    break;
                default:
                    break;
            }

            await manager.getRepository('users').update(user.id, {
                userTypeId: savedStaff.id,
            });

            const userWithRelations = await manager.getRepository('users').findOne({
                where: { id: user.id },
                relations: ['staff', 'staff.teacher', 'staff.teacher.branch' , 'staff.branchManager', 'staff.branchManager.branch', 'staff.studentManagement', 'staff.studentManagement.branch'],
            });

            return userWithRelations;
        });
    }

    private async createTeacher(createStaffDto: CreateStaffDto, staff: Staff, manager: EntityManager, course: Course, branch: Branch) {
        const createTeacherDto: CreateTeacherDto = {
            major: createStaffDto.major,
            academicTitle: createStaffDto.academicTitle,
            degree: createStaffDto.degree,
            staff: staff,
            branch: branch,
        };

 
        const teacher = manager.create(Teacher, createTeacherDto);

        teacher.courses = [course];

        await manager.save(Teacher, teacher);

    }

    private async createBranchManager(staff: Staff, manager: EntityManager, branch: Branch) {
        const createBranchManagerDto: CreateBranchManagerDto = {
            staff: staff,
            branch: branch,
        };
        const bm = manager.create(BranchManager, createBranchManagerDto);

        await manager.save(BranchManager, bm);
    }

    private async createStudentManagement(staff: Staff, manager: EntityManager, branch: Branch) {
        const studentManagement = manager.create(StudentManagement, {
            staff: staff,
            branch: branch,
        });
        await manager.save(StudentManagement, studentManagement);
    }
}
