import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UserService } from 'src/user/user.service';

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService, 
        private userService: UserService, 
        ) {}


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
        const roles = user.getRoles();
        const payload = { sub: user.id, email: user.email, roles: roles };
        const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

        await this.userService.updateRefreshToken(user.id, refreshToken);
        return {
            accessToken: await this.jwtService.signAsync(payload),
            refreshToken,
        };
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            const token = await this.userService.checkRefreshToken(refreshToken);
            if (!token) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            const decoded = this.jwtService.verify(refreshToken);
            const accessPayload = { sub: decoded.sub, email: decoded.email, userType: decoded.userType };
            
            
            return {
                accessToken: await this.jwtService.signAsync(accessPayload)
            };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }

    }

    async revokeRefreshToken(userId: string) {
        await this.userService.updateRefreshToken(userId, '');
        return { message: 'Refresh token revoked successfully' };
    }
}