import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE } from '../../constants/metadata.constant';

export interface Response<T> {
    statusCode: number;
    message: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>  {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();

        const message = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE, [
            context.getHandler(),
            context.getClass(),
        ]) ?? 'Request successful';

        const statusCode = response.statusCode;

        return next.handle().pipe(
            map((data) => ({
                statusCode,
                message,
                data: data || null
            })),
        );
    }
}