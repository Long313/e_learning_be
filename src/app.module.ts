import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { StaffModule } from './staff/staff.module';
import { TeacherModule } from './teacher/teacher.module';
import { BranchModule } from './branch/branch.module';
import { BranchManagerModule } from './branch-manager/branch-manager.module';
import { ParentModule } from './parent/parent.module';
import { MailModule } from './mail/mail.module';
import { CourseModule } from './course/course.module';
import { AdminModule } from './admin/admin.module';
import { CourseRegistrationModule } from './course-registration/course-registration.module';
import { StudentManagementModule } from './student-management/student-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
      retryAttempts: 10,
      retryDelay: 3000,
      logging: true,
      ssl: process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false
    }),
    AuthModule,
    StudentModule,
    UserModule,
    StaffModule,
    TeacherModule,
    BranchModule,
    BranchManagerModule,
    ParentModule,
    CourseModule,
    AdminModule,
    CourseRegistrationModule,
    StudentManagementModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
