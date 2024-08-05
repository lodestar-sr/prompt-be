import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserProfile } from './user.profile';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule],
  providers: [UserProfile, UserService],
  controllers: [UserController],
  exports: [UserProfile, UserService],
})
export class UserModule {}
