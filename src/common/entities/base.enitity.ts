import { AutoMap } from '@automapper/classes';
import {
  BaseEntity as TypeORMBaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity extends TypeORMBaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
