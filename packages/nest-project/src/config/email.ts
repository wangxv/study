import { PugAdapter } from '@nest-modules/mailer';
import path from 'path';

export default {
  // 后面是服务地址，qq可以在qq邮箱中申请
  transport: 'smtps://678594888@qq.com:servicePath@smtp.qq.com',
  defaults: {
    from: '"nest-modules" <modules@nestjs.com>',
  },
  template: {
    dir: path.join(__dirname, './templates/email'),
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
};
