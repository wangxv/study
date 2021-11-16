import { Controller, Get, Post, Patch, Query, Delete, Body, Param, Headers } from '@nestjs/common';
import { HelloService } from './hello.service';
import { Hello, UserRole } from './classes/hello';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('hello')
@Controller('/hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  // 查询
  @Get()
  @ApiQuery({ name: 'name', required: false})
  @ApiQuery({ name: 'role', enum: UserRole})
  @ApiResponse({
    status: 200,
    description: 'get xxxx',
    type: Hello
  })
  fetch(@Query(){ id }, @Headers('token') token): string {
    return this.helloService.fetch(id);
  }

  // 查询
  @Post()
  @ApiBody({ description: '填写更新内容' })
  save(@Body() { message }): string {
    return this.helloService.save(message);
  }

  // 查询
  @Patch(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({ description: '请输入message' })
  update(@Param(){ id }, @Body() { message }): string {
    return this.helloService.update(id, message);
  }

  // 查询
  @Delete()
  remove(@Query(){ id }): string {
    return this.helloService.remove(id);
  }
}
