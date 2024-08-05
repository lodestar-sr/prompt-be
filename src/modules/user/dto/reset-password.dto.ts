import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ default: 'string' })
  @IsNotEmpty({ message: 'Password is a required field' })
  @MinLength(8, { message: 'Password must have minimum of 8 characters' })
  password: string;
}
