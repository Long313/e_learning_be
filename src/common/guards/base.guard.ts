import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public-api.decorator';

@Injectable()
export abstract class BaseGuard implements CanActivate {
  constructor(protected reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; 
    }
    return this.handleGuard(context);
  }

  abstract handleGuard(context: ExecutionContext): boolean | Promise<boolean>;
}