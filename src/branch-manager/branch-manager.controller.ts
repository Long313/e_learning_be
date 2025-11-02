import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BranchManagerService } from './branch-manager.service';
import { CreateBranchManagerDto } from './dto/create-branch-manager.dto';
import { UpdateBranchManagerDto } from './dto/update-branch-manager.dto';
import { PrivateController } from 'src/common/controllers/private.controller';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('branch-manager')
@Roles('admin')
@Controller('branch-manager')
@ApiBearerAuth()
export class BranchManagerController extends PrivateController {
  constructor(private readonly branchManagerService: BranchManagerService) {
    super();
  }

  @Post()
  create(@Body() createBranchManagerDto: CreateBranchManagerDto) {
    return this.branchManagerService.create(createBranchManagerDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.branchManagerService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchManagerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchManagerDto: UpdateBranchManagerDto) {
    return this.branchManagerService.update(+id, updateBranchManagerDto);
  }
}
