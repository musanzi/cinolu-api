import { Activity } from '@/modules/activities/entities';
import { User } from '@/modules/users/entities';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ReviewData } from '../interfaces';

@Entity()
@Unique(['reviewer', 'activity'])
export class Review extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.reviews, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  reviewer: User;

  @ManyToOne(() => Activity, (activity) => activity.reviews, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  activity: Activity;

  @Column({ type: 'jsonb' })
  data: ReviewData;
}
