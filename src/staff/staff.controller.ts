import { Controller, Post, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { ResponseStaffDto } from './dto/staff-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags} from '@nestjs/swagger'
import { PrivateController } from 'src/common/controllers/private.controller';


@ApiTags('staff')
@Controller('staff')
export class StaffController implements PrivateController {
  constructor(private readonly staffService: StaffService) {}

  
  @Post()
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({ status: 201, description: 'The staff member has been successfully created.', type: ResponseStaffDto })
  async createStaff(@Body() createStaffDto: CreateStaffDto) {
    const staff = await this.staffService.create(createStaffDto);
    return plainToInstance(ResponseStaffDto, staff, { excludeExtraneousValues: true });
  }
}
