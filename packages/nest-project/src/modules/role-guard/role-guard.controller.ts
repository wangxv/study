import { Controller, Get, Query } from '@nestjs/common';
import { RoleGuardService } from './role-guard.service';

@Controller()
export class RoleGuardController {
  constructor(private readonly roleGuardService: RoleGuardService) {}

  @Get()
  fetch(@Query() { id }): string {
    return this.roleGuardService.fetch(id);
  }
}
