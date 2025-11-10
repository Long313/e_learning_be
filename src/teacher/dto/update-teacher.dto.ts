import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from './create-teacher.dto';
import { UpdateUserDto } from 'src/user/dto/update-user-dto';

export class UpdateTeacherDto extends PartialType(IntersectionType(UpdateUserDto, CreateTeacherDto)) {}
