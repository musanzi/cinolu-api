import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, OneToMany } from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class ActivityType extends AbstractEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @OneToMany(() => Activity, (activity) => activity.type)
  activities: Activity[];
}
