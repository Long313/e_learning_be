import { IsNotEmpty } from 'class-validator';
import { Branch } from 'src/branch/entities/branch.entity';
import { Staff } from 'src/staff/entities/staff.entity';

export class CreateBranchManagerDto {
    @IsNotEmpty()
    staff: Staff;

    @IsNotEmpty()
    branch: Branch;
}
