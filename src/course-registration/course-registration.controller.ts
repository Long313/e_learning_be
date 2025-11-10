import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UnauthorizedException } from '@nestjs/common';
import { CourseRegistrationService } from './course-registration.service';
import { CreateCourseRegistrationDto } from './dto/create-course-registration.dto';
import { UpdateCourseRegistrationDto } from './dto/update-course-registration.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('course-registration')
export class CourseRegistrationController {
  constructor(private readonly courseRegistrationService: CourseRegistrationService) {}

  @Post()
  create(@Body() createCourseRegistrationDto: CreateCourseRegistrationDto) {
    return this.courseRegistrationService.create(createCourseRegistrationDto);
  }

  @Get()
  findAllByStudent(
    @Query() paginationDto: PaginationDto,
    studentId?: string,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    return this.courseRegistrationService.findAllByStudent(page, limit, studentId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: number,
    @CurrentUser() user: any,
  ) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.courseRegistrationService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCourseRegistrationDto: UpdateCourseRegistrationDto) {
    return this.courseRegistrationService.update(id, updateCourseRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.courseRegistrationService.remove(+id);
  }
}
