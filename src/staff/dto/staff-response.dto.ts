import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseUserResponseDto } from 'src/user/dto/base-user-response.dto';


@Exclude()
export class TeacherInfoDto {
    @ApiProperty({ description: 'Teacher ID', example: 1 })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Major', example: 'Computer Science' })
    @Expose()
    major: string;

    @ApiProperty({ description: 'Academic title', example: 'Giáo sư' })
    @Expose()
    academic_title: string;

    @ApiProperty({ description: 'Degree', example: 'Tiến sĩ' })
    @Expose()
    degree: string;

    @ApiProperty({ description: 'Branch name', example: 'Branch Name' })
    @Expose()
    branchName: string;    
}

@Exclude()
export class BranchManagerInfoDto {
    @ApiProperty({ description: 'Branch manager ID', example: 1 })
    @Expose()
    branchId: number;

    @ApiProperty({ description: 'Branch name', example: 'Branch Name' })
    @Expose()
    branchName: string;
}

@Exclude()
export class StudentManagementInfoDto {
    @ApiProperty({ description: 'Student management ID', example: 1 })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Branch name', example: 'Branch Name' })
    @Expose()
    branchName: string;
}

@Exclude()
export class StaffResponseDto extends BaseUserResponseDto {
    @ApiProperty({
        description: 'Teacher information if staff is a teacher',
        type: TeacherInfoDto,
        required: false,
    })
    @Expose()
    @Type(() => TeacherInfoDto)
    @Transform(({ obj }) => {
        if (obj.staff?.teacher && obj.staff?.teacher?.branch) {
            return {
                id: obj.staff.teacher.id,
                major: obj.staff.teacher.major,
                academic_title: obj.staff.teacher.academicTitle,
                degree: obj.staff.teacher.degree,
                branchName: obj.staff.teacher.branch.name,
            };
        }
        return undefined;
    })
    teacher?: TeacherInfoDto | null;

    @ApiProperty({
        description: 'Branch Manager information if staff is a branch manager',
        type: BranchManagerInfoDto,
        required: false,
    })
    @Expose()
    @Type(() => BranchManagerInfoDto)
    @Transform(({ obj }) => {
        if (obj.staff?.branchManager && obj.staff?.branchManager?.branch) {
            return {
                id: obj.staff.branchManager.id,
                branchName: obj.staff.branchManager.branch.name,
            };
        }
        return undefined;
    })
    branchManager?: BranchManagerInfoDto | null;

    @ApiProperty({
        description: 'Student Management information if staff is a student management',
        type: StudentManagementInfoDto,
        required: false,
    })
    @Expose()
    @Type(() => StudentManagementInfoDto)
    @Transform(({ obj }) => {
        if (obj.staff?.studentManagement && obj.staff?.studentManagement?.branch) {
            return {
                id: obj.staff.studentManagement.id,
                branchName: obj.staff.studentManagement.branch.name,
            };
        }
        return undefined;
    })
    studentManagement?: StudentManagementInfoDto | null;
}