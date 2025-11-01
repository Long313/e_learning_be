import { Injectable, Module } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { JwtPayload } from "./interfaces/jwt-payload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
        });
    }

    async validate(payload: JwtPayload) {
        const user = this.userService.findByEmail(payload.email);
        if (!user) {
            return null;
        }
        return {
            userId: payload.sub,
            email: payload.email,
            roles: payload.roles,
        }
    }
}