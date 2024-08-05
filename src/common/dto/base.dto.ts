import { AutoMap } from '@automapper/classes';

export class BaseDto {
  @AutoMap()
  id: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}
