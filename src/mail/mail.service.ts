import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail') private readonly mailQueue: Queue,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async enqueueActivationEmail(user: { id: string; email: string; fullName?: string }) {
    const token = this.jwt.sign({
      sub: user.id,     
      typ: 'activation',
    });

    const activationLink = `${process.env.APP_URL}/auth/activate?token=${token}`;

    await this.mailQueue.add('sendActivation', {
      to: user.email,
      name: user.fullName || 'User',
      activationLink,
    }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
  }

  async enqueuePasswordResetEmail(user: { id: string; email: string; fullName?: string }) {
    const jti = randomUUID();
    const expiresIn = '1h';
    const token = this.jwt.sign({
      sub: user.id,
      typ: 'password_reset',
    }, { expiresIn, secret: process.env.JWT_PASSWORD_RESET_SECRET, jwtid: jti });

    const ttlSec = 3600;
    await this.redis.setWithTTL(`prt:${jti}`, user.id, ttlSec);
    
    const resetLink = `${process.env.APP_URL}/auth/reset-password-confirm?token=${token}`;

    await this.mailQueue.add('sendPasswordReset', {
      to: user.email,
      name: user.fullName || 'User',
      resetLink,
    }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
  }
}