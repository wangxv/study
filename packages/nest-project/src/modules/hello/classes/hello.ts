import { ApiProperty } from "@nestjs/swagger";

export enum UserRole {
  Admin = 'Admin',
  User = 'User'
}

export class Hello {
  @ApiProperty({ example: '张三', description: '姓名'})
  name: string;

  @ApiProperty({ example: 18, description: '年龄'})
  age: number;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}