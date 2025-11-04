import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ADMIN_TYPES } from 'src/constants/user.constant';
import type { AdminType } from 'src/constants/user.constant';

export class UpdateAdminDto extends PartialType( OmitType(CreateAdminDto, ['password'] as const) ) {
   @ApiProperty({ enum: ADMIN_TYPES, required: false })
  @IsOptional()
  @IsEnum(ADMIN_TYPES)
  type?: AdminType;
}
