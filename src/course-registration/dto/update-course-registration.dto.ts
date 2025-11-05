import { PartialType } from '@nestjs/swagger';
import { CreateCourseRegistrationDto } from './create-course-registration.dto';

export class UpdateCourseRegistrationDto extends PartialType(CreateCourseRegistrationDto) {}
