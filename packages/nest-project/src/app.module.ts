import { AudioModule } from './jobs/audio/audio.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { resolve } from 'path';
import { EmailModule } from './modules/email/email.module';
import { RoleGuardModule } from './modules/role-guard/role-guard.module';
import { ExceptionModule } from './modules/exception/exception.module';
import { HelloModule } from './modules/hello/hello.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MailerModule } from '@nest-modules/mailer';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { StatusMonitorModule } from 'nest-status-monitor';
import statusMonitorConfig from './config/statusMonitor';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AudioModule,
    TasksModule,
    UsersModule,
    AuthModule,
    // 读取配置文件
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    StatusMonitorModule.setUp(statusMonitorConfig),
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('email'),
      inject: [ConfigService],
    }),
    EmailModule,
    RoleGuardModule,
    ExceptionModule,
    HelloModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'hello', method: RequestMethod.POST })
      .forRoutes('hello');
  }
}
