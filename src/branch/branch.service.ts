import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
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

  async create(createBranchDto: CreateBranchDto) {
    try {
      const branch = this.branchRepository.create(createBranchDto);
      await this.branchRepository.save(branch);
      branch.code = `branch_${branch.id}`;
      return await this.branchRepository.save(branch);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Branch with this name already exists');
      }
      console.error(error);
      throw new InternalServerErrorException('Error creating branch');
      
    }
  }

  findAll(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const queryBuilder = this.branchRepository.createQueryBuilder('branch');
    return paginate<Branch>(queryBuilder, { page, limit });
  }

  async findOne(id: number) {
    const branch = await this.branchRepository.findOneBy({ id });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const result = await this.branchRepository.update(id, updateBranchDto);
    if (!result.affected) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    return result;
  }
  

  async remove(id: number) {
    const branch = await this.findOne(id);
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    return this.branchRepository.delete(id);
  }
}
