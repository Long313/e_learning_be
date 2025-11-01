import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const env = configService.get<string>('NODE_ENV', 'development');
        const expiresIn = env === 'production' ? '5m' : '24h';
        
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { 
            expiresIn: expiresIn,
          },
        };
      },
    }),
    UserModule
  ],
  exports: [JwtModule, PassportModule, JwtAuthGuard],
    
})
export class AuthModule {}
