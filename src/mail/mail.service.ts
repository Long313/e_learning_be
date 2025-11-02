import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail') private readonly mailQueue: Queue,
    private readonly jwt: JwtService,
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
    const token = this.jwt.sign({
      sub: user.id,
      typ: 'password_reset',
    }, { expiresIn: '1h' });

    const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${token}`;

    await this.mailQueue.add('sendPasswordReset', {
      to: user.email,
      name: user.fullName || 'User',
      resetLink,
    }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
  }
}