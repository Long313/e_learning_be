import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { removeUndefinedFields } from 'src/common/helpers';
import { StudentResponseDto } from './dto/student-response.dto';
import { plainToInstance } from 'class-transformer';
import { ParentService } from 'src/parent/parent.service';


@Injectable()
export class StudentService {
  constructor(
    private userService: UserService, 
    private parentService: ParentService,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    private dataSource: DataSource,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const existingUser = await this.userService.findByEmail(createStudentDto.email);
    if (existingUser) {
      throw new BadRequestException(`User with email ${createStudentDto.email} already exists`);
    }
    const course = await this.dataSource.getRepository('courses').findOneBy({ id: createStudentDto.courseId });
    if (!course) {
      throw new NotFoundException(`Course with ID ${createStudentDto.courseId} not found`);
    }
    const result = await this.dataSource.transaction(async (manager) => {
      const user = await this.userService.createUserFromExtendedDto(createStudentDto, 'student', manager);

      const student = manager.create(Student, {
        user: user,
        schoolGrade: createStudentDto.schoolGrade,
        startDate: createStudentDto.startDate,
        description: createStudentDto.description,
      });

      const savedStudent = await manager.save(Student, student);

      const createCourseRegistrationDto = {
        student: savedStudent,
        course: course,
        tuitionStatus: 'unpaid',
      };
      await manager.getRepository('course_registrations').save(createCourseRegistrationDto);

      await this.createParent(createStudentDto, manager, savedStudent);

      await manager.getRepository('users').update(user.id, {
        userTypeId: savedStudent.id,
      });

      const studentWithUser = await manager.findOne(Student, {
        where: { id: savedStudent.id },
        relations: ['user'],
      });

      return { studentWithUser, user }
      });

      await this.userService.sendActivationEmail(result.user);
      return plainToInstance(StudentResponseDto, result.studentWithUser, { excludeExtraneousValues: true });
  }

  async findAll(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const queryBuilder = this.studentRepository.createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user');

    const result = await paginate<Student>(queryBuilder, { page, limit });

    return {
      ...result,
      items: plainToInstance(StudentResponseDto, result.items, { excludeExtraneousValues: true}),
    }
  }

  async findOne(id: string) {
    const result = await this.studentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!result) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
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

  private async createParent(createStudentDto: CreateStudentDto, manager: EntityManager, student: Student) {
    const parentDto = {
      fullName: createStudentDto.parentFullName,
      email: createStudentDto.parentEmail,
      phoneNumber: createStudentDto.parentPhoneNumber,
      address: createStudentDto.parentAddress,
      student: student,
    };
    const parent = await this.parentService.create(parentDto, manager);
    return parent;
  }
}
