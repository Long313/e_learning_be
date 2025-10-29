import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login-dto-';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@ApiTags('Authentication')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }


  @Post('login')
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
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    return this.authService.refreshToken(refreshToken);
  }
}
