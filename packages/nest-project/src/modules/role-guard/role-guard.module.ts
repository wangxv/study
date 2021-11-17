import { RoleGuardService } from './role-guard.service';
import { RoleGuardController } from './role-guard.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [RoleGuardController],
  providers: [RoleGuardService],
})
export class RoleGuardModule {}
