import { Controller, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
@ApiTags('User Management')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getProfile(@CurrentUser() user) {
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return this.userService.getProfile(user.userId);
    }
}
