import { AbstractEntity } from '@/shared/abstracts';
import { Program } from '@/modules/programs/entities/program.entity';
import { ActivityParticipation } from '@/modules/participations/entities/activity-participation.entity';
import { ActivityReview } from '@/modules/reviews/entities/activity-review.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { FormResponses } from '../interfaces';
import { ActivityType } from './activity-type.entity';
import { ActivityCategory } from './activity-category.entity';

@Entity()
export class Activity extends AbstractEntity {
  @ManyToOne(() => Program, (program) => program.activities, { onDelete: 'CASCADE' })
  @JoinColumn()
  program: Program;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => ActivityType, (type) => type.activities, { onDelete: 'RESTRICT' })
  @JoinColumn()
  type: ActivityType;

  @ManyToMany(() => ActivityCategory, (category) => category.activities)
  @JoinTable({ name: 'activity_categories' })
  categories: ActivityCategory[];

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  participationForm: FormResponses;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  reviewForm: FormResponses;

  @OneToMany(() => ActivityParticipation, (participation) => participation.activity)
  participations: ActivityParticipation[];

  @OneToMany(() => ActivityReview, (review) => review.activity)
  reviews: ActivityReview[];
}
