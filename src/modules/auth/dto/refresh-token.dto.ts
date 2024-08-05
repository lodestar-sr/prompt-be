import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Token is a required field' })
  @IsJWT()
  token: string;
}
