import { Injectable } from '@nestjs/common';
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
    return this.courseRepository.save(course);
  }

  findAll(page: number, limit: number) {
    const QueryBuilder = this.courseRepository.createQueryBuilder('course');
    return paginate<Course>(QueryBuilder, { page, limit });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['prerequisiteCourses'],
    });
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return this.courseRepository.update(id, updateCourseDto);
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return this.courseRepository.delete(id);
  }
}
