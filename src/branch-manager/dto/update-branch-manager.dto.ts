import { PartialType, IntersectionType, OmitType } from '@nestjs/swagger';
import { CreateBranchManagerDto } from './create-branch-manager.dto';
import { UpdateUserDto } from 'src/user/dto/update-user-dto';

export class UpdateBranchManagerDto extends PartialType(IntersectionType(UpdateUserDto, OmitType(CreateBranchManagerDto, ['staff', 'branch']))) {}
