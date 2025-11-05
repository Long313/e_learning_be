import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchManagerDto } from './dto/create-branch-manager.dto';
import { UpdateBranchManagerDto } from './dto/update-branch-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { BranchManager } from './entities/branch-manager.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BranchManagerService {
  constructor(@InjectRepository(BranchManager) private branchManagerRepository: Repository<BranchManager>) {}

  findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const queryBuilder = this.branchManagerRepository.createQueryBuilder('branch_manager');
    return paginate<BranchManager>(queryBuilder, { page, limit });
  }

  async findOne(id: string) {
    const branchManager = await this.branchManagerRepository.findOneBy({ id });
    if (!branchManager) {
      throw new NotFoundException(`BranchManager with ID ${id} not found`);
    }
    return branchManager;
  }

  async update(id: string, updateBranchManagerDto: UpdateBranchManagerDto) {
    const result = await this.branchManagerRepository.update(id, updateBranchManagerDto);
    if (!result.affected) {
      throw new NotFoundException(`BranchManager with ID ${id} not found`);
    }
    return result;
  }

  async remove(id: string) {
    const result = await this.branchManagerRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`BranchManager with ID ${id} not found`);
    }
    return result;
  }
}
