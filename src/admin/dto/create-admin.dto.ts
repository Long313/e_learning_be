import { CreateUserDto } from "src/user/dto/create-user.dto";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ADMIN_TYPES } from "src/constants/user.constant";

export class CreateAdminDto extends CreateUserDto{
    @IsEnum(ADMIN_TYPES)
    @IsNotEmpty()
    type: string;
}
