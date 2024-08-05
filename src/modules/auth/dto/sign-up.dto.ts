import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'First Name is a required field' })
  @MaxLength(50, { message: 'First Name must have a maximum of 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Last Name is a required field' })
  @MaxLength(50, { message: 'Last Name must have a maximum of 50 characters' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is a required field' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @ApiProperty({ default: 'string' })
  @IsNotEmpty({ message: 'Password is a required field' })
  @MinLength(8, { message: 'Password must have minimum of 8 characters' })
  password: string;
}
