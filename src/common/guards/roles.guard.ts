import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/role.decorator";
import { BaseGuard } from "./base.guard";

@Injectable()
export class RolesGuard extends BaseGuard {
  constructor(reflector: Reflector) {
      super(reflector);
  }

    handleGuard(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

    
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        
        if (!user || !user.roles) {
            return false;
        }

        const hasRoles = requiredRoles.some((role) => user.roles.includes(role));
        return hasRoles;
    }
}