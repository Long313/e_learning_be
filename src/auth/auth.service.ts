import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UserService } from 'src/user/user.service';
import { RefreshToken } from './entitites/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService, 
        private userService: UserService, 
        @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>) {}


    async comparePassword(storedPassword: string, suppliedPassword: string) {
        const [salt, key] = storedPassword.split('.');
        const hash = (await scrypt(suppliedPassword, salt, 32)) as Buffer;
        return key === hash.toString('hex');
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const passwordMatch = await this.comparePassword(user.password, password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload = { sub: user.id, email: user.email, userType: user.userType };
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.refreshTokenRepository.save({ userId: user.id, token: refreshToken });
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken,
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const token = await this.refreshTokenRepository.findOne({ where: { token: refreshToken } });
            if (!token || token.isRevoked) 
            {
                throw new UnauthorizedException('Invalid refresh token');
            }
            const decoded = this.jwtService.verify(refreshToken);
            const accessPayload = { sub: decoded.sub, email: decoded.email, userType: decoded.userType };
            return {
                accessToken: this.jwtService.sign(accessPayload)
            };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: number) {
        const token = await this.refreshTokenRepository.findOne({ where: { user: { id: userId } } });
        if (token) {
            token.isRevoked = true;
            await this.refreshTokenRepository.save(token);
        }
        return { message: 'Logged out successfully' };
    }
}