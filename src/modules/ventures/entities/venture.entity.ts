import { User } from '@/modules/users/entities/user.entity';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { VentureLinks, VentureStatus } from '../interfaces';

@Entity()
export class Venture extends AbstractEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  pitch: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  links: VentureLinks;

  @Column({ type: 'enum', enum: VentureStatus, default: VentureStatus.DRAFT })
  status: VentureStatus;
}
