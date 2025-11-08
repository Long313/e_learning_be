import { Controller, Get, Query, Param, Patch, Body } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import type { TeacherFilters } from 'src/common/filters/filter';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teachers with optional filters and pagination' })
  @ApiResponse({ status: 200, description: 'List of teachers retrieved successfully.' })
  findAll(@Query() paginationDto: PaginationDto, @Query() filters?: TeacherFilters) {
    const { page = 1, limit = 10 } = paginationDto;
    return this.teacherService.findAll(page, limit, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiResponse({ status: 200, description: 'The teacher has been successfully retrieved.' })
  findOne(@Param('id') id: number) {
    return this.teacherService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a teacher by ID' })
  @ApiResponse({ status: 200, description: 'The teacher has been successfully updated.' })
  update(
    @Param('id') id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(id, updateTeacherDto);
  }
}
