import { Portfolio } from '@/modules/portfolios/entities';
import { User } from '@/modules/users/entities';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Program extends AbstractEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @ManyToOne(() => Portfolio, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  portfolio: Portfolio;

  @ManyToMany(() => User)
  @JoinTable({ name: 'program_managers' })
  managers: User[];
}
