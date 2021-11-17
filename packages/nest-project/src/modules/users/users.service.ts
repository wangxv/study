/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { Repository, Connection, getRepository } from 'typeorm';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private connection: Connection,
  ) {}

  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find({ relations: ['photos'] });
  }

  async create(user): Promise<UsersEntity[]> {
    const { name } = user;
    const u = await getRepository(UsersEntity).findOne({ where: { name } });
    if (!u) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          error: 'name must be unique',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.usersRepository.save(user);
  }

  async createMany(users: UsersEntity[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      users.forEach(async (user) => {
        await queryRunner.manager.getRepository(UsersEntity).save(user);
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
