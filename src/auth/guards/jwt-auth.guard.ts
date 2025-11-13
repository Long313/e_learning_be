import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

import { IS_PUBLIC_KEY } from "src/common/decorators/public-api.decorator";
import { TokenExpiredError } from "jsonwebtoken";
import { AuthService } from "../auth.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private authService: AuthService, private jwtService: JwtService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        try {
            const canActivate = await super.canActivate(context) as boolean;
            return canActivate;
        } catch (error) {
            if (error instanceof TokenExpiredError || error instanceof UnauthorizedException && error.message === 'Unauthorized') {
                const refreshToken = request.cookies?.refreshToken;
                if (!refreshToken) {
                    throw new UnauthorizedException('Acess token is expired or missing and refresh token not found');
                }
                try {
                    const { accessToken } = await this.authService.refreshAccessToken(refreshToken);
                    response.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                    });

                    const newPayload = await this.jwtService.verifyAsync(accessToken, {secret: process.env.JWT_SECRET});
                    request.user = {
                        userId: newPayload.sub,
                        email: newPayload.email,
                        roles: newPayload.roles,
                    };
                    return true;
                }
                catch (refreshError) {
                    throw new UnauthorizedException('Session expired. Please log in again.');
                }
            }
            throw error;
        }
    }
}