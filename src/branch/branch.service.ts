import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) {}

  create(createBranchDto: CreateBranchDto) {
    const branch = this.branchRepository.create(createBranchDto);
    return this.branchRepository.save(branch);
  }

  findAll(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const queryBuilder = this.branchRepository.createQueryBuilder('branch');
    return paginate<Branch>(queryBuilder, { page, limit });
  }

  findOne(id: string) {
    return this.branchRepository.findOneBy({ id });
  }

  update(id: string, updateBranchDto: UpdateBranchDto) {
    return this.branchRepository.update(id, updateBranchDto);
  }

  remove(id: string) {
    return this.branchRepository.delete(id);
  }
}
