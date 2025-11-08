import { CreateUserDto } from "src/user/dto/create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateIf } from "class-validator";
import { STAFF_TYPES, ACADEMIC_TITLES, DEGREES, STATUS } from "src/constants/user.constant";
import type { StaffType, DegreeType, AcademicTitleType, StatusType } from "src/constants/user.constant";

export class CreateStaffDto extends CreateUserDto {


    @ApiProperty({ enum: STATUS, default: 'active' })
    @IsEnum(STATUS)
    @IsNotEmpty()
    status: StatusType;


    @ApiProperty({enum: STAFF_TYPES})
    @IsEnum(STAFF_TYPES)
    staffType: StaffType;

    @ApiProperty({ type: Number, example: 50000000 })
    @IsNumber()
    @IsNotEmpty()
    basicSalary: number;

    @ApiProperty({ required: false })
    @ValidateIf(o => o.staffType === 'teacher')
    @IsString()
    @IsNotEmpty()
    major: string;

    @ApiProperty({ required: false, enum: ACADEMIC_TITLES })
    @ValidateIf(o => o.staffType === 'teacher')
    @IsEnum(ACADEMIC_TITLES)
    academicTitle: AcademicTitleType;

    @ApiProperty({ required: false, enum: DEGREES })
    @ValidateIf(o => o.staffType === 'teacher')
    @IsEnum(DEGREES)
    @IsNotEmpty()
    degree: DegreeType;

    @ApiProperty({ required: false })
    @IsString()
    description: string;

    @ApiProperty({ required: false })
    @ValidateIf(o => o.staffType === 'branch_manager' || o.staffType === 'teacher')
    @IsUUID('4', { message: 'branchId must be a valid UUID' })
    @IsNotEmpty()
    branchId: string;

    @ApiProperty({ required: false })
    @ValidateIf(o => o.staffType === 'teacher')
    @IsUUID('4', { message: 'courseId must be a valid UUID' })
    @IsNotEmpty()
    courseId: string;
}