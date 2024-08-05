import {
  createMap,
  extend,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseEntity } from 'typeorm';

import { BaseDto } from '@/common/dto/base.dto';

import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      const baseMapping = createMap(mapper, BaseEntity, BaseDto);
      createMap(
        mapper,
        User,
        UserDto,
        extend(baseMapping),
        forMember(
          (d) => d.fullName,
          mapFrom((s) => `${s.firstName} ${s.lastName}`),
        ),
      );
    };
  }
}
