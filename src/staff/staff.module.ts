import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { UserModule } from 'src/user/user.module';
import { TeacherModule } from 'src/teacher/teacher.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    UserModule,
    TeacherModule
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule {}
