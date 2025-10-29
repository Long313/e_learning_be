import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { paginate } from 'nestjs-typeorm-paginate';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createUser(body: CreateUserDto) {
        const newUser = this.userRepository.create(body);
        return this.userRepository.save(newUser);
    }

    async getAllUsersByType(type: string, page: number = 1, limit: number = 10) {
        page = page < 1 ? 1 : page;
        limit = limit > 100 || limit < 1 ? 10 : limit;
        const queryBuilder = this.userRepository.createQueryBuilder('user')
            .where('user.userType = :type', { type });

        return paginate<User>(queryBuilder, { page, limit });
    }

    async updateUserInfo(id: number, body: UpdateUserDto) {
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

}