import { Injectable, Module } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { Request } from "express";

const cookieExtractor = (req: Request): string | null => {
    let token: string | null = null;
    if (req && req.cookies) {
        token = req.cookies['accessToken'];
    }
    // Fallback to reading from Authorization header
    if (!token && req && req.headers && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    return token;
};


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findByEmail(payload.email);
        if (!user) {
            return null;
        }
        return {
            userId: payload.sub,
            email: payload.email,
            roles: payload.roles,
            status: user.status,
        }
    }
}



