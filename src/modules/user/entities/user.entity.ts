import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.enitity';
import { Role } from '@/common/enums/role.enum';
import { FavoritePrompt } from '@/modules/prompt/entities/favorite-prompt.entity';
import { Prompt } from '@/modules/prompt/entities/prompt.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @AutoMap()
  @Column({ length: 50 })
  firstName: string;

  @AutoMap()
  @Column({ length: 50 })
  lastName: string;

  @AutoMap()
  @Column({ unique: true })
  email: string;

  @AutoMap()
  @Column({ default: false })
  emailVerified: boolean;

  @AutoMap()
  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockUntil: Date | null;

  @AutoMap()
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToMany(() => Prompt, (prompt) => prompt.createdBy)
  createdPrompts: Prompt[];

  @OneToMany(() => FavoritePrompt, (favoritePrompt) => favoritePrompt.user)
  favoritePrompts: FavoritePrompt[];

  incrementFailedLoginAttempts() {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
      this.isActive = false;
      this.lockUntil = new Date(Date.now() + 5 * 60 * 1000); // Lock for 5 minutes
    }
  }

  resetFailedLoginAttempts() {
    this.failedLoginAttempts = 0;
    this.lockUntil = null;
    this.isActive = true;
  }

  isLocked(): boolean {
    if (this.lockUntil && new Date() < this.lockUntil) {
      return true;
    }
    return false;
  }
}
