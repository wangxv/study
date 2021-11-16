// import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { HttpExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局使用中间件
  // app.use(logger)
  
  // 全局过滤器
  // app.useGlobalFilters(new HttpExceptionsFilter)

  // 全局管道
  // app.useGlobalPipes(new ValidationPipe);

  // 设置swagger文档相关的配置
  const swaggerOptions = new DocumentBuilder()
    .setTitle('nest-project api document')
    .setDescription('nest project api document')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
