import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClassDto {
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @ApiProperty({
        description: 'The start date of the class',
        example: '2024-09-01',
    })
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    @ApiProperty({
        description: 'The end date of the class',
        example: '2024-12-15',
    })
    endDate: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The course code associated with the class',
        example: 'course_1',
    })
    courseCode: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The ID of the teacher associated with the class',
        example: 1,
    })
    teacherId: number;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The IDs of the course registrations associated with the class',
        example: [2],
    })
    courseRegistrationIds: number[];
}
