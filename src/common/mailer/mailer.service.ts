import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: configService.get<string>('mail.service'),
      host: configService.get<string>('mail.host'),
      port: configService.get<string>('mail.port'),
      secure: false,
      auth: {
        user: configService.get<string>('mail.email'),
        pass: configService.get<string>('mail.pass'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    attachments?: any[],
  ): Promise<void> {
    const obj: any = {
      from:
        this.configService.get<string>('mail.sender') +
        '<' +
        this.configService.get<string>('mail.email') +
        '>',
      to: to,
      subject: subject,
      text: text,
      html: `<b>${text}</b>`,
    };
    if (attachments) {
      obj.attachments = attachments;
    }
    await this.transporter.sendMail(obj);
  }
}
