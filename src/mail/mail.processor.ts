import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false, // true nếu port là 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendActivationEmail(params: { to: string; name: string; activationLink: string }) {
    const { to, name, activationLink } = params;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject: 'Kích hoạt tài khoản của bạn',
      html: `
        <p>Xin chào ${name},</p>
        <p>Nhấn vào liên kết sau để kích hoạt tài khoản:</p>
        <p><a href="${activationLink}">${activationLink}</a></p>
        <p>Liên kết sẽ hết hạn sau ${process.env.JWT_ACTIVATION_EXPIRES || '24h'}.</p>
      `,
    });
  }

  async sendPasswordResetEmail(params: { to: string; name: string; resetLink: string }) {
    const { to, name, resetLink } = params;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject: 'Đặt lại mật khẩu của bạn',
      html: `
        <p>Xin chào ${name},</p>
        <p>Nhấn vào liên kết sau để đặt lại mật khẩu:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Liên kết sẽ hết hạn sau ${process.env.JWT_RESET_PASSWORD_EXPIRES || '24h'}.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      `,
    });
  }
}
