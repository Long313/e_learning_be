import { CreateUserDto } from "src/user/dto/create-user.dto";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ADMIN_TYPES } from "src/constants/user.constant";
import { ApiProperty } from "@nestjs/swagger";
import type { AdminType } from "src/constants/user.constant";
export class CreateAdminDto extends CreateUserDto{
    @ApiProperty({ enum: ADMIN_TYPES })
    @IsEnum(ADMIN_TYPES)
    @IsNotEmpty()
    type: AdminType;
}
