import { AutoMap } from '@automapper/classes';

import { BaseDto } from '@/common/dto/base.dto';

export class PromptDto extends BaseDto {
  @AutoMap()
  title: string;

  @AutoMap()
  description: string;

  createdBy: string;

  createdById: string;

  likesCount: number;

  isFavorite: boolean;
}
