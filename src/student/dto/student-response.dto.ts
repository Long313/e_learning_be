import { Exclude, Expose, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserResponseDto } from 'src/user/dto/base-user-response.dto';
import { Course } from 'src/course/entities/course.entity';
import type { ClassStatusType } from 'src/class/entities/class.entity';


export class StudentClassInfoDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() courseTitle: string;
  @ApiProperty() @Expose() teacherName: string | null;
  @ApiProperty() @Expose() startDate: Date | null;
  @ApiProperty() @Expose() endDate: Date | null;
  @ApiProperty() @Expose() status: ClassStatusType;
}

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

    @Transform(({ obj }) => obj.student?.branch?.name)
    @Expose()
    branchName: string;

    @Transform(({ obj }) => obj.student?.courses)
    @Expose()
    courses: Course[];

    @ApiProperty({ type: [StudentClassInfoDto] })
    @Transform(({ obj }) => {
    const regs = obj.student?.courseRegistrations ?? [];
    return regs
      .filter((r: any) => r.class)
      .map((r: any) => {
        const cls = r.class;
        const courseTitle = cls?.course?.title ?? null;

        const teacherName =
          cls?.teacher?.staff?.user?.fullName ??
          null;

        return {
          id: cls.id,
          startDate: cls.startDate ?? null,
          endDate: cls.endDate ?? null,
          status: cls.status,
          courseTitle,
          teacherName,
        };
      });
  })
  @Type(() => StudentClassInfoDto)
  @Expose()
  classes: StudentClassInfoDto[];


}