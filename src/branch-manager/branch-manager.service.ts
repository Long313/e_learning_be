import { Injectable } from '@nestjs/common';
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

  findOne(id: string) {
    return `This action returns a #${id} branchManager`;
  }

  update(id: string, updateBranchManagerDto: UpdateBranchManagerDto) {
    return `This action updates a #${id} branchManager`;
  }

  remove(id: string) {
    return `This action removes a #${id} branchManager`;
  }
}
