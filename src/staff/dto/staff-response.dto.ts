import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseUserResponseDto } from 'src/teacher/dto/base-user-response.dto';


@Exclude()
export class TeacherInfoDto {
    @ApiProperty({ description: 'Major', example: 'Computer Science' })
    @Expose()
    major: string;

    @ApiProperty({ description: 'Academic title', example: 'Giáo sư' })
    @Expose()
    academic_title: string;

    @ApiProperty({ description: 'Degree', example: 'Tiến sĩ' })
    @Expose()
    degree: string;
}

@Exclude()
export class BranchManagerInfoDto {
    @ApiProperty({ description: 'Branch ID', example: 'branch-id' })
    @Expose()
    branchId: string;

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
    @Transform(({ obj }) => obj.teacher || null)
    teacher?: TeacherInfoDto | null;

    @ApiProperty({
        description: 'Branch Manager information if staff is a branch manager',
        type: BranchManagerInfoDto,
        required: false,
    })
    @Expose()
    @Type(() => BranchManagerInfoDto)
    @Transform(({ obj }) => {
        if (obj.branchManager && obj.branchManager.branch) {
            return {
                branchId: obj.branchManager.branch.id,
                branchName: obj.branchManager.branch.name,
            };
        }
        return null;
    })
    branchManager?: BranchManagerInfoDto | null;
}