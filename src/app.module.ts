import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { Student } from './student/entities/student.entity';
import { StaffModule } from './staff/staff.module';
import { TeacherModule } from './teacher/teacher.module';
import { BranchModule } from './branch/branch.module';
import { Branch } from './branch/entities/branch.entity';
import { Teacher } from './teacher/entities/teacher.entity';
import { Staff } from './staff/entities/staff.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, envFilePath: '.env',
    }),
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
      // dropSchema: true,
    }),
    AuthModule,
    StudentModule,
    UserModule,
    StaffModule,
    TeacherModule,
    BranchModule,
  ],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor
  }]
})
export class AppModule { }
