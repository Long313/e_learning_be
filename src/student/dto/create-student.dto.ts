import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsDate, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class CreateStudentDto extends OmitType(CreateUserDto, ['phoneNumber'] as const) {

    @ApiProperty({
        description: 'Student phone number',
        example: '123-456-7890',
    })
    @IsString()
    @IsOptional()
    phoneNumber: string;

    @ApiProperty({ description: 'The grade of the student', example: 10 })
    @IsNumber()
    @IsNotEmpty()
    schoolGrade: number;

    @ApiProperty({ description: 'The start date of the student', example: '2023-09-01' })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({ description: 'Student parent\'s full name', example: 'Liam Doe' })
    @IsString()
    @IsNotEmpty()
    parentFullName: string;

    @ApiProperty({ description: 'Student parent\'s email', example: 'liam.doe@example.com' })
    @IsString()
    @IsOptional()
    parentEmail: string;

    @ApiProperty({ description: 'Student parent\'s phone number', example: '+1234567890' })
    @IsString()
    @IsNotEmpty()
    parentPhoneNumber: string;

    @ApiProperty({ description: 'Student parent\'s address', example: '123 Main St, City, Country' })
    @IsString()
    @IsOptional()
    parentAddress: string;

    @ApiProperty({ description: 'Branch code', example: 'branch_1' })
    @IsString()
    @IsNotEmpty()
    branchCode: string;

    @ApiProperty({ description: 'Registered course code', example: 'course_1' })
    @IsString()
    @IsNotEmpty()
    courseCode: string;

    @ApiProperty({ description: 'Description', example: 'Enrolled for advanced mathematics course' })
    @IsString()
    description: string;
}
