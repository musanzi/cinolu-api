import { Activity } from '@/modules/activities/entities';
import { User } from '@/modules/users/entities';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ParticipationData, ParticipationStatus } from '../interfaces';

@Entity()
@Unique(['participant', 'activity'])
export class Participation extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.participations, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  participant: User;

  @ManyToOne(() => Activity, (activity) => activity.participations, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  activity: Activity;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  data: ParticipationData;

  @Column({ type: 'enum', enum: ParticipationStatus, default: ParticipationStatus.PENDING })
  status: ParticipationStatus;
}
