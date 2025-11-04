import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACTIVATION_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
