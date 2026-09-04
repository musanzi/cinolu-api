import { AbstractEntity } from '@/shared/abstracts';
import { Activity } from '@/modules/activities/entities/activity.entity';
import { FormResponses } from '@/modules/activities/interfaces';
import { User } from '@/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ParticipationStatus } from '../interfaces';

@Entity()
@Unique(['activityId', 'userId'])
export class ActivityParticipation extends AbstractEntity {
  @ManyToOne(() => Activity, (activity) => activity.participations, { onDelete: 'CASCADE' })
  @JoinColumn()
  activity: Activity;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  responses: FormResponses;

  @Column({ type: 'enum', enum: ParticipationStatus, default: ParticipationStatus.PENDING })
  status: ParticipationStatus;

  @Column({ type: 'timestamptz' })
  submitDate: Date;
}
