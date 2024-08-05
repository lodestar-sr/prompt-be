import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) public repository: Repository<User>) {
    super(repository);
  }

  async createOne(req: CrudRequest, dto: DeepPartial<User>): Promise<User> {
    const userExists = await this.findOne({ where: { email: dto.email } });
    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    return super.createOne(req, dto);
  }

  async updateOne(req: CrudRequest, dto: DeepPartial<User>): Promise<User> {
    const role = await this.getOne(req);
    if (dto.email && dto.email !== role.email) {
      const userExists = await this.findOne({ where: { email: dto.email } });
      if (userExists) {
        throw new ConflictException('Email already exists');
      }
    }
    return super.updateOne(req, dto);
  }
}
