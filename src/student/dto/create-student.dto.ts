import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateStudentDto extends CreateUserDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    schoolGrade: number;

    @ApiProperty()
    startDate: Date;
}
