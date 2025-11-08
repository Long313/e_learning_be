
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { STATUS } from 'src/constants/user.constant';
import type { StatusType } from 'src/constants/user.constant';
export class UpdateUserDto extends PartialType( OmitType(CreateUserDto, ['email', 'password', 'userType'] as const)) {
    @ApiProperty({ description: 'The user\'s status', example: 'active', required: false })
    @IsOptional()
    @IsString()
    @IsEnum(
        STATUS,
        { message: `status must be one of the following values: ${Object.values(STATUS).filter(v => typeof v === 'string').join(', ')}` }
    )
    status?: StatusType;
}