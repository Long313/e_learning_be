import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository, DataSource } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { removeUndefinedFields } from 'src/common/helpers';
import { StudentResponseDto } from './dto/student-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StudentService {
  constructor(
    private userService: UserService, 
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private dataSource: DataSource
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await this.userService.createUserFromExtendedDto(createStudentDto, 'student', manager);

      const student = manager.create(Student, {
        user: user,
        schoolGrade: createStudentDto.schoolGrade,
        startDate: createStudentDto.startDate,
      });

      const savedStudent = await manager.save(Student, student);

      await manager.getRepository('users').update(user.id, {
        userTypeId: savedStudent.id,
      });

      const studentWithUser = await manager.findOne(Student, {
        where: { id: savedStudent.id },
        relations: ['user'],
      });

      return plainToInstance(StudentResponseDto, studentWithUser, { excludeExtraneousValues: true});
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const queryBuilder = this.studentRepository.createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user');

    const result = await paginate<Student>(queryBuilder, { page, limit });

    return {
      ...result,
      items: plainToInstance(StudentResponseDto, result.items, { excludeExtraneousValues: true}),
    }
  }

  findOne(id: string) {
    const result = this.studentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return plainToInstance(StudentResponseDto, result, { excludeExtraneousValues: true });
  }

  async update(userId: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOneBy({ user: { id: userId } });
    if (!student) {
      throw new NotFoundException(`Student with user ID ${userId} not found`);
    }
    const studentId = student.id;
    await this.userService.updateUserInfo(userId, updateStudentDto);
    const updateDto = removeUndefinedFields<UpdateStudentDto>({
      schoolGrade: updateStudentDto.schoolGrade,
      startDate: updateStudentDto.startDate,
    });

    await this.studentRepository.update(studentId, updateDto);
    return this.findOne(studentId);
  }
}
