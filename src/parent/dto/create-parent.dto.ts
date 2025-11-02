import {IsNotEmpty, IsString, IsOptional} from 'class-validator';
import { Student } from 'src/student/entities/student.entity';

export class CreateParentDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsNotEmpty()
    student: Student;
}