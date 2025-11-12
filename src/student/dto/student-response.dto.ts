import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserResponseDto } from 'src/user/dto/base-user-response.dto';
import { Course } from 'src/course/entities/course.entity';

@Exclude()
export class StudentResponseDto extends BaseUserResponseDto {

    @ApiProperty({
        description: 'Current school grade',
        example: 10,
    })
    @Transform(({ obj }) => obj.student?.schoolGrade)
    @Expose()
    currentGrade: number;

    @ApiProperty({
        description: 'Starting date of the student',
        example: '2020-09-01T00:00:00.000Z',
    })
    @Transform(({ obj }) => obj.student?.startDate)
    @Type(() => Date)
    @Expose()
    startDate: Date;

    @Transform(({ obj }) => obj.student?.courses)
    @Expose()
    courses: Course[];
}