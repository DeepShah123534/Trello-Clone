import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import * as nodemailer from 'nodemailer';
import resetPasswordTemplate from './reset-password-template';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  async sendPasswordResetEmail(user: User, token: string) {
    const mailUser = this.configService.get<string>('MAIL_USER');
    const mailPass = this.configService.get<string>('MAIL_PASS');

    console.log('MAIL_USER:', mailUser);
    console.log('MAIL_PASS:', mailPass ? '✔️ present' : '❌ missing');

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    try {
      const result = await transporter.sendMail({
        from: mailUser,
        to: user.email,
        subject: 'Project Planning Tool - Password Reset',
        html: resetPasswordTemplate(token, user.id), // You can replace this with actual content
      });

      console.log('✅ Email sent successfully:', result.response);
    } catch (error) {
      console.error('❌ Error sending email:', error.message || error);
    }
  }
}