import { AbstractEntity } from '@/shared/abstracts';
import { Activity } from '@/modules/activities/entities/activity.entity';
import { FormResponses } from '@/modules/activities/interfaces';
import { User } from '@/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['activityId', 'userId'])
export class ActivityReview extends AbstractEntity {
  @ManyToOne(() => Activity, (activity) => activity.reviews, { onDelete: 'CASCADE' })
  @JoinColumn()
  activity: Activity;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  responses: FormResponses;

  @Column({ type: 'timestamptz' })
  submitDate: Date;
}
