import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateCourseRegistrationDto } from './dto/create-course-registration.dto';
import { UpdateCourseRegistrationDto } from './dto/update-course-registration.dto';
import { CourseRegistration } from './entities/course-registration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { VIEW_STUDENT_COURSE_REGISTRATION_ROLES } from 'src/constants/course.constant';
import { Class } from 'src/class/entities/class.entity';

@Injectable()
export class CourseRegistrationService {
  constructor(
    @InjectRepository(CourseRegistration) private courseRegistrationRepository: Repository<CourseRegistration>,
  ) {}
  create(createCourseRegistrationDto: CreateCourseRegistrationDto) {
    const courseRegistration = this.courseRegistrationRepository.create(createCourseRegistrationDto);
    return this.courseRegistrationRepository.save(courseRegistration);
  }

  findAllByStudent(page: number, limit: number, studentId?: string) {
    const queryBuilder = this.courseRegistrationRepository.createQueryBuilder('course_registration');
    if (studentId) {
      queryBuilder.andWhere('course_registration.studentId = :studentId', { studentId });
    }
    queryBuilder.leftJoinAndSelect('course_registration.course', 'course');
    return paginate<CourseRegistration>(queryBuilder, { page, limit });
  }

  async findOne(id: number, user: any) {
     const registration = await this.courseRegistrationRepository.findOne({
      where: { id },
      relations: ['student', 'student.user', 'course'],
    });
    if (!registration) throw new NotFoundException('Course registration not found');

    const roles: string[] = Array.isArray(user?.roles) ? user.roles : [];
    const hasViewRole = roles.some((r) => VIEW_STUDENT_COURSE_REGISTRATION_ROLES.includes(r));
    if (!hasViewRole) throw new ForbiddenException();

    // Nếu chỉ là student (không có quyền quản trị), chỉ được xem bản ghi của chính mình
    const canViewAll = roles.some((r) => r !== 'student' && VIEW_STUDENT_COURSE_REGISTRATION_ROLES.includes(r));
    if (!canViewAll) {
      const currentUserId = user.id ?? user.userId;
      const ownerUserId = registration.student?.user?.id;
      if (!ownerUserId || ownerUserId !== currentUserId) {
        throw new ForbiddenException();
      }
    }

    return registration;
  }

  async assignToClass(registrationId: number, classEntity: Class) {
    const registration = await this.courseRegistrationRepository.findOne({
      where: { id: registrationId, isAssigned: false },
    });
    if (!registration) {
      throw new NotFoundException(`Course registration with ID ${registrationId} not found or assigned`);
    }
    registration.class = classEntity;
    registration.isAssigned = true;
    return this.courseRegistrationRepository.save(registration);
  }

  update(id: number, updateCourseRegistrationDto: UpdateCourseRegistrationDto) {
    return `This action updates a #${id} courseRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseRegistration`;
  }
}
