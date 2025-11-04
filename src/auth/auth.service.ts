import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
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
    ) { }

    async comparePassword(storedPassword: string, suppliedPassword: string) {
        const [salt, key] = storedPassword.split('.');
        const hash = (await scrypt(suppliedPassword, salt, 32)) as Buffer;
        return key === hash.toString('hex');
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');

        const passwordMatch = await this.comparePassword(user.password, password);
        if (!passwordMatch) throw new UnauthorizedException('Invalid email or password');

        const roles = user.getRoles();
        const payload = { sub: user.id, email: user.email, roles };
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
            if (!token) throw new UnauthorizedException('Invalid refresh token');

            const decoded = this.jwtService.verify(refreshToken);
            const accessPayload = { sub: decoded.sub, email: decoded.email, userType: decoded.userType };

            return {
                accessToken: await this.jwtService.signAsync(accessPayload),
            };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async revokeRefreshToken(userId: string) {
        await this.userService.updateRefreshToken(userId, '');
        return { message: 'Refresh token revoked successfully' };
    }

    async validateActiveToken(token?: string) {
        if (!token) throw new BadRequestException('Missing token');

        let payload: any;
        try {
            payload = this.jwtService.verify(token, { secret: process.env.JWT_ACTIVATION_SECRET });
        } catch {
            throw new BadRequestException('Invalid or expired token');
        }

        if (payload.typ !== 'activation' || !payload.sub) {
            throw new BadRequestException('Invalid token payload');
        }

        const user = await this.userService.findById(payload.sub);
        if (!user) throw new NotFoundException('User not found');

        if (user.status === 'active') throw new BadRequestException('User is already verified');

        await this.userService.updateUserInfo(user.id, { status: 'active' });
        return { message: 'Account activated successfully' };
    }

    async resendActivationEmail(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        if (user.status === 'active') throw new BadRequestException('User is already verified');

        await this.userService.sendActivationEmail(user);
        return { message: 'Activation email resent successfully' };
    }

    async requestPasswordReset(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');

        await this.userService.sendPasswordResetEmail(user);
        return { message: 'Password reset link sent successfully' };
    }

    async resetPassword(token: string, newPassword: string) {
        let payload: any;
        try {
            payload = this.jwtService.verify(token, { secret: process.env.JWT_PASSWORD_RESET_SECRET });
        } catch {
            throw new BadRequestException('Invalid or expired token');
        }

        if (payload.typ !== 'password_reset' || !payload.sub) {
            throw new BadRequestException('Invalid token payload');
        }

        const user = await this.userService.findById(payload.sub);
        if (!user) throw new NotFoundException('User not found');

        const hashedPassword = await this.userService.hashPassword(newPassword);
        await this.userService.updateUserInfo(user.id, { password: hashedPassword });

        return { message: 'Password reset successfully' };
    }
}
