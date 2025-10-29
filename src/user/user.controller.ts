import { Controller } from '@nestjs/common';
import { ApiTags} from '@nestjs/swagger';



@ApiTags('User Management')
@Controller('user')
export class UserController {
    constructor() {
    }

}
