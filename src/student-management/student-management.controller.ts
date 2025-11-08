import { Controller } from '@nestjs/common';
import { StudentManagementService } from './student-management.service';

@Controller('student-management')
export class StudentManagementController {
  constructor(private readonly studentManagementService: StudentManagementService) {}
}
