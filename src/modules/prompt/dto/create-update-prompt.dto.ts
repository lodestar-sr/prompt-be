import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUpdatePromptDto {
  @IsNotEmpty({ message: 'Title is a required field' })
  @MaxLength(500, { message: 'Title must have a maximum of 500 characters' })
  title: string;

  @IsNotEmpty({ message: 'Description is a required field' })
  description: string;
}
