import { Injectable , NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { randomBytes, scrypt as _scrypt, hash } from 'crypto';
import { promisify } from 'util';
import { UserType } from 'src/constants/user.constant';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { removeUndefinedFields } from 'src/common/helpers';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createUser(body: CreateUserDto) {
        const hashedPassword = await this.hashPassword(body.password);
        const newUser = this.userRepository.create({
            ...body,
            password: hashedPassword,
        });
        return this.userRepository.save(newUser);
    }

    async getAllUsersByType(type: string, paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .where('user.userType = :type', { type });

        return paginate<User>(queryBuilder, { page, limit });
    }

    async updateUserInfo(id: number, body: UpdateUserDto) {
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

    async createUserFromExtendedDto(dto: any, userType: UserType) {
            const userDto: CreateUserDto = {
            email: dto.email,
            password: dto.password,
            fullName: dto.fullName,
            gender: dto.gender,
            userType: userType,
            yearOfBirth: dto.yearOfBirth,
            phoneNumber: dto.phoneNumber,
            address: dto.address,
            avatarUrl: dto.avatarUrl,
        };
        
        return this.createUser(userDto);
    }

    async updateUserFromExtendedDto(id: number, dto: any) {
        const updateDto: UpdateUserDto = removeUndefinedFields<UpdateUserDto>({
            password: dto.password,
            fullName: dto.fullName,
            gender: dto.gender,
            yearOfBirth: dto.yearOfBirth,
            phoneNumber: dto.phoneNumber,
            address: dto.address,
            avatarUrl: dto.avatarUrl,
        });

        return this.updateUserInfo(id, updateDto);
    }
}