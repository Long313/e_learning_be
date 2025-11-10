import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBranchManagerDto } from './dto/update-branch-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { BranchManager } from './entities/branch-manager.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import type { BranchManagerFilters } from 'src/common/filters/filter';
import { plainToInstance } from 'class-transformer';
import { StaffResponseDto } from '../staff/dto/staff-response.dto';

@Injectable()
export class BranchManagerService {
  constructor(
    @InjectRepository(BranchManager) private branchManagerRepository: Repository<BranchManager>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(pagination: PaginationDto, filters: BranchManagerFilters = {}) {
    const { page = 1, limit = 10 } = pagination;
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.staff', 'staff')
      .leftJoinAndSelect('staff.branchManager', 'branchManager')
      .leftJoinAndSelect('branchManager.branch', 'branch')
      .where('branchManager.id IS NOT NULL')
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
      where: { id },
      relations: ['staff', 'staff.branchManager', 'staff.branchManager.branch'],
    });
    if (!user) {
      throw new NotFoundException(`BranchManager with ID ${id} not found`);
    }
    return plainToInstance(StaffResponseDto, user, { excludeExtraneousValues: true });
  }

  async update(id: number, updateBranchManagerDto: UpdateBranchManagerDto) {
    const result = await this.userRepository.manager.transaction(async (manager: EntityManager) => {
      const user = await manager.findOne(User, {
        where: { id },
        relations: ['staff', 'staff.branchManager'],
      });
      if (!user) {
        throw new NotFoundException(`BranchManager with ID ${id} not found`);
      }

        const userDto = {
            fullName: updateBranchManagerDto.fullName ?? user.fullName,
            gender: updateBranchManagerDto.gender ?? user.gender,
            dateOfBirth: updateBranchManagerDto.dateOfBirth ?? user.dateOfBirth,
            phoneNumber: updateBranchManagerDto.phoneNumber ?? user.phoneNumber,
            address: updateBranchManagerDto.address ?? user.address,
            avatarUrl: updateBranchManagerDto.avatarUrl ?? user.avatarUrl,
            status: updateBranchManagerDto.status ?? user.status,
        };
      await manager.update(User, id, userDto);
      const updatedUser = await manager.findOne(User, {
        where: { id },
        relations: ['staff', 'staff.branchManager', 'staff.branchManager.branch'],
      });
      return updatedUser;
    });
    return plainToInstance(StaffResponseDto, result, { excludeExtraneousValues: true });
  }
}
