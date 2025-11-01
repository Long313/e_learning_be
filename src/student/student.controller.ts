import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth  } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Public } from 'src/common/decorators/public-api.decorator';

@ApiTags('Student Management')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  
  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'The student has been successfully created.' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Roles('admin', 'manager')
  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'List of students retrieved successfully.' })
  @ApiBearerAuth('JWT-auth')
  @Roles('admin', 'manager')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentService.findAll(paginationDto);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiResponse({ status: 200, description: 'The student has been successfully retrieved.' })
  @ApiBearerAuth('JWT-auth')
  @Roles('admin', 'manager', 'student')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student by ID' })
  @ApiResponse({ status: 200, description: 'The student has been successfully updated.' })
  @ApiBearerAuth('JWT-auth')
  @Roles('admin', 'manager', 'student')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }
}
