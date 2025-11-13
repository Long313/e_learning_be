import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { StudentManagementService } from './student-management.service';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateStudentManagementDto } from './dtos/update-student-management.dto';

@Controller('student-management')
export class StudentManagementController {
  constructor(private readonly studentManagementService: StudentManagementService) {

  }

    @Get()
    @ApiProperty({ description: 'Get all student management staff' })
    @ApiResponse({ status: 200, description: 'Student management staff retrieved successfully'})
    @ResponseMessage('Student management staff retrieved successfully')
    async findAll() {
      return this.studentManagementService.findAll();
    }

    @Get(':id')
    @ApiProperty({ description: 'Get a student management staff by ID' })
    @ApiResponse({ status: 200, description: 'Student management staff retrieved successfully'})
    @ResponseMessage('Student management staff retrieved successfully')
    async findOne(@Param('id') id: number) {
      return this.studentManagementService.findOne(id);
    }

    @Patch(':id')
    @ApiProperty({ description: 'Update a student management staff by ID' })
    @ApiResponse({ status: 200, description: 'Student management staff updated successfully'})
    @ResponseMessage('Student management staff updated successfully')
    async update(@Param('id') id: number, @Body() updateDto: UpdateStudentManagementDto) {
      return this.studentManagementService.update(id, updateDto);
    }
}
