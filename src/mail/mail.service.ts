import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly jwt: JwtService) { }

  /** Cấu hình transporter */
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // ⚠️ chỉ nên bật trong môi trường DEV
    },
  });

  /** 📩 Gửi email kích hoạt tài khoản */
  async sendActivationEmail(user: { id: string; email: string; fullName?: string }) {
    const expiresIn: JwtSignOptions['expiresIn'] =
      (process.env.JWT_ACTIVATION_EXPIRES ?? '24h') as JwtSignOptions['expiresIn'];

    const token = this.jwt.sign(
      {
        sub: String(user.id),
        typ: 'activation',
      },
      {
        secret: process.env.JWT_ACTIVATION_SECRET as string,
        expiresIn,
      },
    );

    const activationLink = `${process.env.APP_URL}/auth/activate?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: user.email,
      subject: 'Kích hoạt tài khoản của bạn',
      html: `
        <p>Xin chào ${user.fullName || 'User'},</p>
        <p>Nhấn vào liên kết sau để kích hoạt tài khoản của bạn:</p>
        <p><a href="${activationLink}" target="_blank">${activationLink}</a></p>
        <p>Liên kết này sẽ hết hạn sau ${expiresIn}.</p>
      `,
    });
  }

  /** 🔑 Gửi email đặt lại mật khẩu */
  async sendPasswordResetEmail(user: { id: string; email: string; fullName?: string }) {
    const jti = randomUUID();
    const expiresIn: JwtSignOptions['expiresIn'] =
      (process.env.JWT_ACTIVATION_EXPIRES ?? '1h') as JwtSignOptions['expiresIn'];
    const token = this.jwt.sign(
      {
        sub: String(user.id),
        typ: 'password_reset',
      },
      {
        secret: process.env.JWT_PASSWORD_RESET_SECRET as string,
        expiresIn,
        jwtid: jti,
      },
    );

    const resetLink = `${process.env.APP_URL}/auth/reset-password-confirm?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: user.email,
      subject: 'Đặt lại mật khẩu của bạn',
      html: `
        <p>Xin chào ${user.fullName || 'User'},</p>
        <p>Nhấn vào liên kết sau để đặt lại mật khẩu:</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <p>Liên kết này sẽ hết hạn sau ${expiresIn}.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      `,
    });
  }
}
