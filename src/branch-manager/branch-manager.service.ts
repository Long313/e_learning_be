import { Injectable } from '@nestjs/common';
import { CreateBranchManagerDto } from './dto/create-branch-manager.dto';
import { UpdateBranchManagerDto } from './dto/update-branch-manager.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchManager } from './entities/branch-manager.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BranchManagerService {
  constructor(@InjectRepository(BranchManager) private branchManagerRepository: Repository<BranchManager>) {}

  create(createBranchManagerDto: CreateBranchManagerDto) {
    const branchManager = this.branchManagerRepository.create(createBranchManagerDto) ;
    return this.branchManagerRepository.save(branchManager);
  }

  findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const queryBuilder = this.branchManagerRepository.createQueryBuilder('branch_manager');
    return paginate<BranchManager>(queryBuilder, { page, limit });
  }

  findOne(id: number) {
    return `This action returns a #${id} branchManager`;
  }

  update(id: number, updateBranchManagerDto: UpdateBranchManagerDto) {
    return `This action updates a #${id} branchManager`;
  }

  remove(id: number) {
    return `This action removes a #${id} branchManager`;
  }
}
