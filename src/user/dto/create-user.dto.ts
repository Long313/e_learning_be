import {IsBoolean, IsString, IsNumber, IsEmail} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_TYPES, GENDERS } from '../../constants/user.constant';

export class CreateUserDto {
    @ApiProperty(        {
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

    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
    })
    @IsString()
    fullName: string;

    @ApiProperty({
        description: 'User year of birth',
        example: 1990,
    })
    @IsNumber()
    yearOfBirth: number;

    @ApiProperty({
        description: 'User phone number',
        example: '123-456-7890',
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        description: 'User address',
        example: '123 Main St, Anytown, USA',
    })
    @IsString()
    address?: string;

    @ApiProperty({
        description: 'User avatar URL',
        example: 'https://example.com/avatar.jpg',
    })
    @IsString()
    avatarUrl?: string;

    @ApiProperty({ enum: USER_TYPES })
    @IsString()
    userType: typeof USER_TYPES[number];

    @ApiProperty({
        description: 'Is the user active?',
        example: true,
    })
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty({enum: GENDERS})
    @IsString()
    gender: typeof GENDERS[number];
}