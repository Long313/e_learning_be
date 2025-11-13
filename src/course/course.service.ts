import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,

  ) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      const { prerequisiteCourseIds, ...courseData } = createCourseDto;
      let prerequisiteCourses: Course[] = [];
      if (prerequisiteCourseIds?.length) {
        prerequisiteCourses = await Promise.all(
          prerequisiteCourseIds.map(async (id) => {
            const course = await this.findOne(id);
            if (!course) {
              throw new Error(`Prerequisite course with ID ${id} not found`);
            }
            return course;
          })

        )
      }
      const course = this.courseRepository.create({
        ...courseData,
        prerequisiteCourses,
      });
      await this.courseRepository.save(course);
      course.code = `course_${course.id}`;
      return await this.courseRepository.save(course);
  } 
  catch (error) {
    if (error.code === '23505') {
      throw new ConflictException('Course with this title already exists');
    }
    console.error(error);
    throw new InternalServerErrorException('Error creating course');
  }
}

  findAll(page: number, limit: number) {
    const QueryBuilder = this.courseRepository.createQueryBuilder('course');
    return paginate<Course>(QueryBuilder, { page, limit });
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['prerequisiteCourses'],
    });
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return this.courseRepository.update(id, updateCourseDto);
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return this.courseRepository.delete(id);
  }

  async findOneByCode(code: string) {
    const course =  await this.courseRepository.findOne({
      where: { code },
      relations: ['prerequisiteCourses'],
    });
    if (!course) {
      throw new Error(`Course with code ${code} not found`);
    }
    return course;
  }
}
