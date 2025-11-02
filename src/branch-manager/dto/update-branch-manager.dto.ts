import { PartialType } from '@nestjs/swagger';
import { CreateBranchManagerDto } from './create-branch-manager.dto';

export class UpdateBranchManagerDto extends PartialType(CreateBranchManagerDto) {}
