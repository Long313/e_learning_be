import { CreateUserDto } from "src/user/dto/create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { STAFF_TYPES, ACADEMIC_TITLES, DEGREES } from "src/constants/user.constant";
import type { StaffType, DegreeType, AcademicTitleType } from "src/constants/user.constant";

export class CreateStaffDto extends CreateUserDto {
    @ApiProperty(
        {enum: STAFF_TYPES}
    )
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
    academic_title: AcademicTitleType;

    @ApiProperty({ required: false, enum: DEGREES })
    @ValidateIf(o => o.staffType === 'teacher')
    @IsEnum(DEGREES)
    @IsNotEmpty()
    degree: DegreeType;
}