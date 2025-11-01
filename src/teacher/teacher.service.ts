import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
    constructor(
    ) {}

    create(createTeacherDto: CreateTeacherDto, manager: EntityManager) {
        return manager.create(Teacher, createTeacherDto);
    } 
}
