import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestDto {
    @ApiProperty()
    @IsString()
    password: string;
}