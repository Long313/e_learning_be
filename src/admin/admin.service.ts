import { Injectable } from '@nestjs/common';
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

  create(createAdminDto: CreateAdminDto) {
    const manager = this.dataSource.manager;
    return manager.transaction(async transactionalEntityManager => {
      const user = transactionalEntityManager.create('User', {
        email: createAdminDto.email,
        password: this.userService.hashPassword(createAdminDto.password),
        fullName: createAdminDto.fullName,
        gender: createAdminDto.gender,
        dayOfBirth: createAdminDto.dayOfBirth,
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

  findOne(id: string) {
    const result = this.adminRepository.findOne({ where: { id }, relations: ['user'] });
    return result;
  }

  update(id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminRepository.update(id, updateAdminDto);
  }

  remove(id: string) {
    return this.adminRepository.delete(id);
  }
}
