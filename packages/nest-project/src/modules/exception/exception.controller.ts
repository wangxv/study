import {
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Delete,
  Body,
  Param,
  Headers,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { ExceptionService } from './exception.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { HttpExceptionsFilter } from '../../common/filters/http-exception.filter';

@ApiBearerAuth()
@ApiTags('exception')
@UseFilters(new HttpExceptionsFilter())
@Controller('/exception')
export class ExceptionController {
  constructor(private readonly exceptionService: ExceptionService) {}

  // 查询
  @Get()
  fetch(@Query() { id }, @Headers('token') token): string {
    return this.exceptionService.fetch(id);
  }

  // 查询
  @Post()
  @ApiBody({ description: '填写更新内容' })
  save(@Body() { message }): string {
    return this.exceptionService.save(message);
  }

  // 查询
  @Patch(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({ description: '请输入message' })
  update(@Param('id', new ParseIntPipe()) { id }, @Body() { message }): string {
    return this.exceptionService.update(id, message);
  }

  // 查询
  @Delete()
  remove(@Query() { id }): string {
    return this.exceptionService.remove(id);
  }
}
