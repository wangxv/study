/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard(['local']))
  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard(['jwt']))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
