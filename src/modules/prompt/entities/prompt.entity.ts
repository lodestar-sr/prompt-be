import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.enitity';
import { User } from '@/modules/user/entities/user.entity';

import { FavoritePrompt } from './favorite-prompt.entity';

@Entity({ name: 'prompts' })
export class Prompt extends BaseEntity {
  @AutoMap()
  @Column({ length: 500 })
  title: string;

  @AutoMap()
  @Column({ type: 'text' })
  description: string;

  @AutoMap()
  @ManyToOne(() => User, { nullable: false })
  @Type(() => User)
  createdBy: Relation<User>;

  @OneToMany(() => FavoritePrompt, (favoritePrompt) => favoritePrompt.prompt, {
    cascade: true,
  })
  favoritedBy: FavoritePrompt[];
}
