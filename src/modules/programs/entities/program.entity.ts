import { AbstractEntity } from '@/shared/abstracts';
import { Portfolio } from '@/modules/portfolios/entities/portfolio.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Activity } from '@/modules/activities/entities/activity.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Program extends AbstractEntity {
  @ManyToOne(() => Portfolio, (portfolio) => portfolio.programs, { onDelete: 'CASCADE' })
  @JoinColumn()
  portfolio: Portfolio;

  @ManyToMany(() => User)
  @JoinTable({ name: 'program_managers' })
  programManagers: User[];

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @OneToMany(() => Activity, (activity) => activity.program)
  activities: Activity[];
}
