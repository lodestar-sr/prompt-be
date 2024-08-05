import { IsEmail, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';

import { Role } from '@/common/enums/role.enum';

export class CreateUpdateUserDto {
  @IsNotEmpty({ message: 'First Name is a required field' })
  @MaxLength(50, { message: 'First Name must have a maximum of 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Last Name is a required field' })
  @MaxLength(50, { message: 'Last Name must have a maximum of 50 characters' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is a required field' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsEnum(Role)
  @IsNotEmpty({ message: 'Role is a required field' })
  role: Role;

  isActive?: boolean;
}
