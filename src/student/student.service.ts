import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository, DataSource } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { removeUndefinedFields } from 'src/common/helpers';

@Injectable()
export class StudentService {
  constructor(
    private userService: UserService, 
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private dataSource: DataSource
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await this.userService.createUserFromExtendedDto(createStudentDto, 'student');

      const student = manager.create(Student, {
        user: user,
        schoolGrade: createStudentDto.schoolGrade,
        startDate: createStudentDto.startDate,
      });

      const savedStudent = await manager.save(Student, student);

      await manager.update('users', user.id, {
        userTypeId: savedStudent.id,
      });

      return { user, student: savedStudent };
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const queryBuilder = this.studentRepository.createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user');

    return paginate<Student>(queryBuilder, { page, limit });
  }

  findOne(id: number) {
    return this.studentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    await this.userService.updateUserInfo(id, updateStudentDto);
    const updateDto = removeUndefinedFields<UpdateStudentDto>({
      schoolGrade: updateStudentDto.schoolGrade,
      startDate: updateStudentDto.startDate,
    });
    await this.studentRepository.update(id, updateDto);
    return this.findOne(id);
  }
}
