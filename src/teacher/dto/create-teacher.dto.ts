import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Branch } from 'src/branch/entities/branch.entity';
import { ACADEMIC_TITLES, DEGREES,  } from 'src/constants/user.constant';
import type { AcademicTitleType, DegreeType } from 'src/constants/user.constant';
import { Staff } from 'src/staff/entities/staff.entity';

export class CreateTeacherDto {
    @ApiProperty({ description: 'The teacher\'s major', example: 'Computer Science' })
    @IsString()
    @IsNotEmpty()
    major: string;

    @ApiProperty({ description: 'The teacher\'s academic title', example: 'Giáo sư' })
    @IsEnum(ACADEMIC_TITLES)
    @IsNotEmpty()
    academicTitle: AcademicTitleType

    @ApiProperty({ description: 'The teacher\'s degree', example: 'Tiến sĩ' })
    @IsEnum(DEGREES)
    @IsNotEmpty()
    degree: DegreeType;
    
    @IsNotEmpty()
    staff: Staff

    @IsNotEmpty()
    branch: Branch;
}