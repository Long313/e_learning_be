import { Body, Controller, Post, Query, UseGuards, Get, BadRequestException, UnauthorizedException, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { changePasswordDto, LoginDto } from './dto/login.dto';
import { RefreshTokenDto, RevokeRefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public-api.decorator';
import { ResetPasswordConfirmDto, ResetPasswordRequestDto } from './dto/reset-password.dto';
import type { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';



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

  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = loginDto;
    const token = await this.authService.login(email, password);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = token;

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
    return token;
  }

  @Post('refresh-token')
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refreshAccessToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = refreshTokenDto;
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    if (!accessToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
    return { accessToken };
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Body() revokeRefreshTokenDto: RevokeRefreshTokenDto) {
    const { userId } = revokeRefreshTokenDto;
    return this.authService.revokeRefreshToken(userId);
  }

  @Get('activate')
  @ApiResponse({ status: 200, description: 'Token is valid, user is verified.' })
  @ApiOperation({ summary: 'Check active token from activation link' })
  @Public()
  async active(@Res() res: Response, @Query('token') token?: string) {
    const result = await this.authService.validateActiveToken(token);
    if (result.success) {
      return res.redirect(HttpStatus.FOUND, `${process.env.CLIENT_SUCCESS_URL}`);
    }
    return res.redirect(HttpStatus.FOUND, `${process.env.CLIENT_URL}`);
  }

  @Post('resend-activation')
  @ApiResponse({ status: 200, description: 'Activation email resent successfully.' })
  @ApiOperation({ summary: 'Resend activation email' })
  @Public()
  async resendActivationEmail(@Body() resetPasswordRequestDto: ResetPasswordRequestDto) {
    const { email } = resetPasswordRequestDto;
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.resendActivationEmail(email);
  }

  @Post('reset-password-request')
  @ApiResponse({ status: 200, description: 'Password reset link sent successfully.' })
  @ApiOperation({ summary: 'Request password reset link' })
  @Public()
  async requestPasswordReset(@Body() resetPasswordRequestDto: ResetPasswordRequestDto) {
    const { email } = resetPasswordRequestDto;
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password-confirm')
  @ApiResponse({ status: 200, description: 'Password has been reset successfully.' })
  @ApiOperation({ summary: 'Confirm password reset with token' })
  @Public()
  async confirmPasswordReset(
    @Body() resetPasswordConfirmDto: ResetPasswordConfirmDto,
  ) {
    const { token, newPassword } = resetPasswordConfirmDto;
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required');
    }
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('change-password')
  @ApiResponse({ status: 200, description: 'Password has been changed successfully.' })
  @ApiOperation({ summary: 'Change password for authenticated user' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() changePasswordDto: changePasswordDto,
    @CurrentUser() user: any,
  ) {
    const { currentPassword, newPassword } = changePasswordDto;
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Current password and new password are required');
    }
    const userId = user.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.authService.changePassword(userId, currentPassword, newPassword);
  }
}
