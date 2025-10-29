import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
        @ApiProperty()
        @IsString()
        password: string;

        @ApiProperty()
        @IsString()
        fullName: string;

        @ApiProperty()
        @IsNumber()
        yearOfBirth: number;

        @ApiProperty()
        @IsString()
        phoneNumber: string;

        @ApiProperty()  
        @IsString()
        address?: string;

        @ApiProperty()
        @IsString()
        avatarUrl?: string;

        @ApiProperty()
        @IsBoolean()
        isActive?: boolean;
}