import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import type { StudentManagerFilters } from 'src/common/filters/filter';
import { paginate } from 'nestjs-typeorm-paginate';
import { plainToInstance } from 'class-transformer';
import { StaffResponseDto } from 'src/staff/dto/staff-response.dto';
import { UpdateStudentManagementDto } from './dtos/update-student-management.dto';

@Injectable()
export class StudentManagementService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async findAll(page:number = 1, limit:number = 10, filters: StudentManagerFilters = {}) {
        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.staff', 'staff')
            .leftJoinAndSelect('staff.studentManagement', 'studentManagement')
            .leftJoinAndSelect('studentManagement.branch', 'branch')
            .where('studentManagement.id IS NOT NULL')
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

    async findOne(id: number) {
        const user = await this.userRepository.findOne({
            where: { staff: { studentManagement: { id } } },
            relations: ['staff', 'staff.studentManagement', 'staff.studentManagement.branch'],
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return plainToInstance(StaffResponseDto, user, { excludeExtraneousValues: true });
    }

    async update(id: number, updateDto: UpdateStudentManagementDto) {
        const result = await this.userRepository.manager.transaction(async (manager) => {
            const user = await manager.findOne(User, {
                where: { staff: { studentManagement: { id } } },
                relations: ['staff', 'staff.studentManager'],
            });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            const userDto = {
                fullName: updateDto.fullName ?? user.fullName,
                gender: updateDto.gender ?? user.gender,
                dateOfBirth: updateDto.dateOfBirth ?? user.dateOfBirth,
                phoneNumber: updateDto.phoneNumber ?? user.phoneNumber,
                address: updateDto.address ?? user.address,
                avatarUrl: updateDto.avatarUrl ?? user.avatarUrl,
                status: updateDto.status ?? user.status,
            };
            await manager.update(User, id, userDto);

            return await manager.findOne(User, {
                where: { staff: { studentManagement: { id } } },
                relations: ['staff', 'staff.studentManagement', 'staff.studentManagement.branch'],
            });
        });
        return plainToInstance(StaffResponseDto, result, { excludeExtraneousValues: true });
    }
}