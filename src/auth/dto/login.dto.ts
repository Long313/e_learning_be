import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
    })
    @IsString()
    password: string;
}

export class changePasswordDto {
    @ApiProperty({
        description: 'Current user password',
        example: 'currentPassword123',
    })
    @IsString()
    currentPassword: string;

    @ApiProperty({
        description: 'New user password',
        example: 'newPassword123',
    })
    @IsString()
    newPassword: string;
}
