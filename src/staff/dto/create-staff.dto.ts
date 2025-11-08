import { CreateUserDto } from "src/user/dto/create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { STAFF_TYPES, ACADEMIC_TITLES, DEGREES, STATUS } from "src/constants/user.constant";
import type { StaffType, DegreeType, AcademicTitleType, StatusType } from "src/constants/user.constant";

export class CreateStaffDto extends CreateUserDto {


    @ApiProperty({ enum: STATUS, default: 'active' })
    @IsEnum(
        STATUS,
        { message: `status must be one of the following values: ${Object.values(STATUS).filter(v => typeof v === 'string').join(', ')}` }
    )
    @IsNotEmpty()
    status: StatusType;


    @ApiProperty({enum: STAFF_TYPES})
    @IsEnum(
        STAFF_TYPES,
        { message: `staffType must be one of the following values: ${Object.values(STAFF_TYPES).filter(v => typeof v === 'string').join(', ')}` }
    )
    @IsNotEmpty()
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
    @IsEnum(
        ACADEMIC_TITLES,
        { message: `academicTitle must be one of the following values: ${Object.values(ACADEMIC_TITLES).filter(v => typeof v === 'string').join(', ')}` }
    )
    academicTitle: AcademicTitleType;

    @ApiProperty({ required: false, enum: DEGREES })
    @ValidateIf(o => o.staffType === 'teacher')
    @IsEnum(
        DEGREES,
        { message: `degree must be one of the following values: ${Object.values(DEGREES).filter(v => typeof v === 'string').join(', ')}` }
    )
    @IsNotEmpty()
    degree: DegreeType;

    @ApiProperty({ required: false })
    @IsString()
    description: string;

    @ApiProperty({ required: false })
    @ValidateIf(o => o.staffType === 'branch_manager' || o.staffType === 'teacher')
    @IsNotEmpty()
    branchCode: string;

    @ApiProperty({ required: false })
    @ValidateIf(o => o.staffType === 'teacher')
    @IsNotEmpty()
    courseCode: string;
}