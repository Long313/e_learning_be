import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PrivateController } from 'src/common/controllers/private.controller';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Public } from 'src/common/decorators/public-api.decorator';

@ApiTags('branch')
@Controller('branch')
// @ApiBearerAuth()
// @Roles('admin')
export class BranchController extends PrivateController {
  constructor(private readonly branchService: BranchService) {
    super();
  }

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.branchService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.branchService.remove(id);
  }
}
