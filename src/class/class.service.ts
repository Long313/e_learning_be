import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CourseRegistrationService } from 'src/course-registration/course-registration.service';
import { CourseService } from 'src/course/course.service';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class) private readonly classRepository: Repository<Class>,
    private readonly courseService: CourseService,
    private readonly teacherService: TeacherService,
    private readonly courseRegistrationService: CourseRegistrationService,
  ) {}

  async create(createClassDto: CreateClassDto) {
    const courseCode = createClassDto.courseCode;
    const teacherId = createClassDto.teacherId;
    const courseRegistrationIds = createClassDto.courseRegistrationIds;

    const course = await this.courseService.findOneByCode(courseCode);
    const teacher = await this.teacherService.findByIdAndReturnTeacherEntity(teacherId);
    if (teacher.courses.every((t_course) => t_course.code !== courseCode)) {
      throw new Error(`Teacher with ID ${teacherId} does not teach course with code ${courseCode}`);
    }
    const classEntity = this.classRepository.create({
      ...createClassDto,
      course: course,
      teacher: teacher,
    });
    const saved_class = await this.classRepository.save(classEntity);

  try {
    for (const registrationId of courseRegistrationIds ?? []) {
      await this.courseRegistrationService.assignToClass(registrationId, saved_class);
    }
  } catch (error) {
    await this.classRepository.delete(saved_class.id); // rollback lớp vừa tạo
    throw new BadRequestException(error?.message || 'Assign registration failed'); // PHẢI throw
  }
    return this.classRepository.findOne({
      where: { id: saved_class.id },
    });
  }

  findAll(courseCode?: string) {
    if (courseCode) {
      return this.classRepository.find({
        where: { course: { code: courseCode } },
      });
    }
    return this.classRepository.find();
  }

  findOne(id: number) {
    const classEntity = this.classRepository.findOne({
      where: { id },
    });
    return classEntity;
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
