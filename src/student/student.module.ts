import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { UserModule } from 'src/user/user.module';
import { ParentModule } from 'src/parent/parent.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [
    TypeOrmModule.forFeature([Student, User]),
    UserModule, 
    ParentModule,
    ]
})
export class StudentModule {}
