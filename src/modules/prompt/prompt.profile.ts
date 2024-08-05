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

import { PromptDto } from './dto/prompt.dto';
import { Prompt } from './entities/prompt.entity';

@Injectable()
export class PromptProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      const baseMapping = createMap(mapper, BaseEntity, BaseDto);
      createMap(
        mapper,
        Prompt,
        PromptDto,
        extend(baseMapping),
        forMember(
          (d) => d.createdBy,
          mapFrom((s) => `${s.createdBy.firstName} ${s.createdBy.lastName}`),
        ),
        forMember(
          (d) => d.createdById,
          mapFrom((s) => s.createdBy.id),
        ),
        forMember(
          (d) => d.likesCount,
          mapFrom((s) => s.favoritedBy.length),
        ),
      );
    };
  }
}
