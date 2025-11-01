import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public-api.decorator';


@ApiTags('Authentication')
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }


  @Post('login')
  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const token = await this.authService.login(email, password);
    if (!token) {
      return { message: 'Invalid email or password' };
    }
    return token;
  }

  @Post('refresh-token')
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Body('userId') userId: string) {
    return this.authService.revokeRefreshToken(userId);
  }
}
