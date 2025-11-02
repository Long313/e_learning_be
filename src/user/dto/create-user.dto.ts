import {IsString, IsDate, IsEmail, IsNotEmpty, IsEnum} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GENDERS} from '../../constants/user.constant';
import type {UserType, GenderType} from '../../constants/user.constant';
import { Type } from 'class-transformer';

export class CreateUserDto {
    @ApiProperty(        {
            description: 'User email address',
            example: 'vanphuoc1028@gmail.com',
        })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'User full name',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({enum: GENDERS})
    @IsEnum(GENDERS)
    @IsNotEmpty()
    gender: GenderType;

    @ApiProperty({
        description: 'User birth date',
        example: '1990-01-01',
        type: String,
    })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    dayOfBirth: Date;

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
}