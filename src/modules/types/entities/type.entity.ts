import { Activity } from '@/modules/activities/entities';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('activity_type')
export class Type extends AbstractEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @ManyToMany(() => Activity, (activity) => activity.types)
  activities: Activity[];
}
