import { ExceptionService } from './exception.service';
import { ExceptionController } from './exception.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ExceptionController],
  providers: [ExceptionService],
})
export class ExceptionModule {}
