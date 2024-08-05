import { AutoMap } from '@automapper/classes';

import { BaseDto } from '@/common/dto/base.dto';

export class UserDto extends BaseDto {
  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  @AutoMap()
  emailVerified: boolean;

  @AutoMap()
  isActive: boolean;

  fullName: string;
}
