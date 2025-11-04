import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty} from 'class-validator';

export class CreateBranchDto {
    @ApiProperty(
        {
            description: 'Name of the branch',
            example: 'Downtown Branch',
        }
    )
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty(
        {
            description: 'Address of the branch',
            example: '123 Main St, Cityville',
        }
    )
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty(
        {
            description: 'Phone number of the branch',
            example: '(123) 456-7890',
        }
    )
    @IsString()
    @IsNotEmpty()
    phone: string;
}
