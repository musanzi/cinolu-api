import { Sector } from '@/modules/sectors/entities';
import { User } from '@/modules/users/entities';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { VentureSocials, VentureStage, VentureStatus } from '../interfaces';

@Entity()
export class Venture extends AbstractEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cover?: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  socials: VentureSocials;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @Column({ type: 'enum', enum: VentureStage })
  stage: VentureStage;

  @Column({ type: 'enum', enum: VentureStatus, default: VentureStatus.PENDING })
  status: VentureStatus;

  @ManyToMany(() => Sector)
  @JoinTable({ name: 'venture_sectors' })
  sectors: Sector[];
}
