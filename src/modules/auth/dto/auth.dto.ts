import { UserDto } from '@/modules/user/dto/user.dto';

export class AuthDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
