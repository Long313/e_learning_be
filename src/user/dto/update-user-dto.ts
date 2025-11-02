
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { STATUS } from 'src/constants/user.constant';
import type { StatusType } from 'src/constants/user.constant';
export class UpdateUserDto extends PartialType( OmitType(CreateUserDto, ['email'] as const)) {
    @IsOptional()
    @IsString()
    @IsEnum(STATUS)
    status?: StatusType;
}