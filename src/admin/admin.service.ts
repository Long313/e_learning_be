import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { DataSource, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const existingUser = await this.userService.findByEmail(createAdminDto.email);
    if (existingUser) {
      throw new BadRequestException(`User with email ${createAdminDto.email} already exists`);
    }
    const manager = this.dataSource.manager;
    return manager.transaction(async transactionalEntityManager => {
      const user = transactionalEntityManager.create('User', {
        email: createAdminDto.email,
        password: this.userService.hashPassword(createAdminDto.password),
        fullName: createAdminDto.fullName,
        gender: createAdminDto.gender,
        dateOfBirth: createAdminDto.dateOfBirth,
        status: 'active',
        userType: 'admin',
      });
      await transactionalEntityManager.save(user);

      const admin = transactionalEntityManager.create('Admin', {
        type: createAdminDto.type,
        user: user,
      });
      await transactionalEntityManager.save(admin);

      return admin;
    });
  }

  findAll(page: number, limit: number) {
    const queryBuilder = this.adminRepository.createQueryBuilder('admin').leftJoinAndSelect('admin.user', 'user');
    return paginate<Admin>(queryBuilder, { page, limit });
  }

  async findOne(id: string) {
    const result = await this.adminRepository.findOne({ where: { id }, relations: ['user'] });
    if (!result) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return result;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const result = await this.adminRepository.update(id, updateAdminDto);
    if (!result.affected) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return result;
  }

  async remove(id: string) {
    const result = await this.adminRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return result;
  }
}
