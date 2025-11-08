import { Module } from '@nestjs/common';
import { StudentManagementService } from './student-management.service';
import { StudentManagementController } from './student-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [StudentManagementController],
  providers: [StudentManagementService],
})
export class StudentManagementModule {}
