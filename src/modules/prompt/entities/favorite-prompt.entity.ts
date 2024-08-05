import { Entity, ManyToOne, Relation, Unique } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.enitity';
import { User } from '@/modules/user/entities/user.entity';

import { Prompt } from './prompt.entity';

@Entity({ name: 'favorite_prompts' })
@Unique(['user', 'prompt'])
export class FavoritePrompt extends BaseEntity {
  @ManyToOne(() => User, (user) => user.favoritePrompts)
  user: Relation<User>;

  @ManyToOne(() => Prompt, (prompt) => prompt.favoritedBy)
  prompt: Relation<Prompt>;
}
