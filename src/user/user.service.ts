import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import type { UserType } from 'src/constants/user.constant';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { removeUndefinedFields } from 'src/common/helpers';
import { StudentResponseDto } from 'src/student/dto/student-response.dto';
import { plainToInstance } from 'class-transformer';
import { MailService } from 'src/mail/mail.service';
import { StaffResponseDto } from 'src/staff/dto/staff-response.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private mailService: MailService,
    ) { }

    async createUser(body: CreateUserDto, manager?: EntityManager) {
        const repo = manager ? manager.getRepository(User) : this.userRepository;
        const hashedPassword = await this.hashPassword(body.password);
        const newUser = repo.create({
            ...body,
            password: hashedPassword,
        });
        return repo.save(newUser);
    }

    async getAllUsersByType(type: string, paginationDto: PaginationDto) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .where('user.userType = :type', { type });

        return paginate<User>(queryBuilder, { page, limit });
    }

    async updateUserInfo(id: string, body: UpdateUserDto) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepository.update(id, body);
        return this.userRepository.findOneBy({ id });
    }

    async hashPassword(password: string) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        return salt + '.' + hash.toString('hex');
    }

    async findByEmail(email: string) {
        return this.userRepository.findOneBy({ email });
    }

    async createUserFromExtendedDto(dto: any, userType: UserType, manager?: EntityManager) {
        const userDto: CreateUserDto = {
            email: dto.email,
            password: dto.password,
            fullName: dto.fullName,
            gender: dto.gender,
            dayOfBirth: dto.dayOfBirth,
            phoneNumber: dto.phoneNumber,
            address: dto.address,
            avatarUrl: dto.avatarUrl,
            userType,
        };
        return this.createUser(userDto, manager);
    }

    async updateUserFromExtendedDto(id: string, dto: any) {
        const updateDto: UpdateUserDto = removeUndefinedFields<UpdateUserDto>({
            password: dto.password,
            fullName: dto.fullName,
            gender: dto.gender,
            dayOfBirth: dto.dayOfBirth,
            phoneNumber: dto.phoneNumber,
            address: dto.address,
            avatarUrl: dto.avatarUrl,
        });

        return this.updateUserInfo(id, updateDto);
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        await this.userRepository.update(userId, { refreshToken });
    }

    async checkRefreshToken(refreshToken: string) {
        return this.userRepository.findOneBy({ refreshToken });
    }

    async getProfile(userId: string) {
        
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['student', 'staff', 'staff.teacher', 'staff.branchManager', 'staff.branchManager.branch'] });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        if (user.userType === 'student') {
            const student = user.student;
            const userWithoutStudent = Object.assign(new User(), user);
            return plainToInstance(
                StudentResponseDto,
                { ...student, user: userWithoutStudent },
                { excludeExtraneousValues: true },
            );
        }

        if (user.userType === 'staff') {
            const staff = user.staff;
            const userWithoutStaff = Object.assign(new User(), user);
            return plainToInstance(
                StaffResponseDto,
                { ...staff, user: userWithoutStaff },
                { excludeExtraneousValues: true },
            );
        }
    }

    async findById(id: string) {
        return this.userRepository.findOneBy({ id });
    }

    async sendActivationEmail(user: User) {
        await this.mailService.sendActivationEmail({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        });
    }

    async sendPasswordResetEmail(user: User) {
        await this.mailService.sendPasswordResetEmail({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        });
    }
}
