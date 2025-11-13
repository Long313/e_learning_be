import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  findAll(@Param('courseCode') courseCode?: string) {
    return this.classService.findAll(courseCode);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.classService.remove(id);
  }
}
