/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmail() {
    this.mailerService.sendMail({
      to: '12345678@qq.com',
      from: '678594888@qq.com',
      subject: 'test',
      template: 'welcome', // 对应模板 tempaltes/email/welcome.pug
    });
  }
}
