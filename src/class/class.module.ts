import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { CourseModule } from 'src/course/course.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { CourseRegistrationModule } from 'src/course-registration/course-registration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    CourseModule,
    TeacherModule,
    CourseRegistrationModule
  ],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
