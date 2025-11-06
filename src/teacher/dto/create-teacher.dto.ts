import { IsString, IsNotEmpty } from 'class-validator';
import { Branch } from 'src/branch/entities/branch.entity';
import { Staff } from 'src/staff/entities/staff.entity';

export class CreateTeacherDto {
    @IsString()
    @IsNotEmpty()
    major: string;

    @IsString()
    academic_title: string | null;

    @IsString()
    @IsNotEmpty()
    degree: string;
    
    @IsNotEmpty()
    staff: Staff

    @IsNotEmpty()
    branch: Branch;
}