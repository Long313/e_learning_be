import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { PrerequisiteCourse } from '../entities/prerequisite-course.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
    @ApiProperty(
        { example: 'Introduction to Programming', description: 'The title of the course' }
    )
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty(
        { example: 'This course provides an introduction to programming concepts...', description: 'The description of the course' }
    )
    @IsNotEmpty()
    @IsString()
    description: string;


    @ApiProperty(
        { example: 40, description: 'Number of lessons in the course' }
    )
    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @ApiProperty(
        { example: 100, description: 'The price of the course in VND' }
    )
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({
        type: [Number],
        description: 'List of prerequisite course IDs',
        example: [],
    })
    prerequisiteCourseIds: number[];
}
