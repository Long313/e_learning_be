import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherFilters } from 'src/common/filters/filter';
import { plainToInstance } from 'class-transformer';
import { StaffResponseDto } from '../staff/dto/staff-response.dto';
import { User } from 'src/user/entities/user.entity';
import { UpdateTeacherDto } from './dto/update-teacher.dto';


@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher) private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    create(createTeacherDto: CreateTeacherDto, manager: EntityManager) {
        return manager.create(Teacher, createTeacherDto);
    }

    async findAll(page: number, limit: number, filters: TeacherFilters = {}) {
        const queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.staff', 'staff')
        .leftJoinAndSelect('staff.teacher', 'teacher')
        .leftJoinAndSelect('teacher.branch', 'branch')
        .where('teacher.id IS NOT NULL')
        .orderBy('user.createdAt', 'DESC');
        
        if (filters.branchId) {
            queryBuilder.andWhere('branch.id = :branchId', { branchId: filters.branchId });
        }
        
        const result = await paginate<User>(queryBuilder, { page, limit });
        const staffDtos = plainToInstance(StaffResponseDto, result.items, { excludeExtraneousValues: true });
        return {
            ...result,
            items: staffDtos,
        };
    }

    async findById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['staff', 'staff.teacher', 'staff.branchManager', 'staff.branchManager.branch'],
        });
        if (!user) {
            throw new NotFoundException(`Teacher with ID ${id} not found`);
        }
        return plainToInstance(StaffResponseDto, user, { excludeExtraneousValues: true });
    }

    async update(id: number, updateTeacherDto: UpdateTeacherDto) {
        const result = await this.userRepository.manager.transaction(async (manager) => {
            const user = await manager.findOne(User, {
            where: { id },
            relations: ['staff', 'staff.teacher'],
        });
        if (!user || !user.staff?.teacher) {
            throw new NotFoundException(`Teacher with ID ${id} not found`);
        }
        const userDto = {
            fullName: updateTeacherDto.fullName ?? user.fullName,
            gender: updateTeacherDto.gender ?? user.gender,
            dateOfBirth: updateTeacherDto.dateOfBirth ?? user.dateOfBirth,
            phoneNumber: updateTeacherDto.phoneNumber ?? user.phoneNumber,
            address: updateTeacherDto.address ?? user.address,
            avatarUrl: updateTeacherDto.avatarUrl ?? user.avatarUrl,
            status: updateTeacherDto.status ?? user.status,
        };
        await manager.update(User, id, userDto);

        const teacherDto = {
            major: updateTeacherDto.major ?? user.staff.teacher.major,
            academicTitle: updateTeacherDto.academicTitle ?? user.staff.teacher.academicTitle,
            degree: updateTeacherDto.degree ?? user.staff.teacher.degree,
        };
        await manager.update(Teacher, user.staff.teacher.id, teacherDto);

        const updatedUser = await manager.findOne(User, {
            where: { id },
            relations: ['staff', 'staff.teacher', 'staff.teacher.branch'],
        });
        return updatedUser;
        });
        return plainToInstance(StaffResponseDto, result, { excludeExtraneousValues: true });
    }
}

    

