import { Controller, Post, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffResponseDto } from './dto/staff-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags} from '@nestjs/swagger'
import { PrivateController } from 'src/common/controllers/private.controller';
import { Public } from 'src/common/decorators/public-api.decorator';


@ApiTags('staff')
@Controller('staff')
export class StaffController extends PrivateController {
  constructor(private readonly staffService: StaffService) {
    super();
  }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new staff member' })
  @ApiResponse({ status: 201, description: 'The staff member has been successfully created.', type: StaffResponseDto })
  async createStaff(@Body() createStaffDto: CreateStaffDto) {
    const staff = await this.staffService.create(createStaffDto);
    return plainToInstance(StaffResponseDto, staff, { excludeExtraneousValues: true });
  }
}
