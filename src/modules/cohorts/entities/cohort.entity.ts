import { Activity } from '@/modules/activities/entities';
import { Program } from '@/modules/programs/entities';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Cohort extends AbstractEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @ManyToOne(() => Program, (program) => program.cohorts, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  program: Program;

  @OneToMany(() => Activity, (activity) => activity.cohort)
  activities: Activity[];
}
