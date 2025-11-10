import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordRequestDto {
    @ApiProperty({
        description: 'User email',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;
}

export class ResetPasswordConfirmDto {
    @ApiProperty({
        description: 'Reset token',
        example: '1234567890abcdef',
    })
    @IsString()
    token: string;

    @ApiProperty({
        description: 'New password',
        example: 'newPassword123',
    })
    @IsString()
    newPassword: string;
}