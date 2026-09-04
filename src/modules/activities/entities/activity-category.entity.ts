import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Activity } from './activity.entity';

@Entity()
export class ActivityCategory extends AbstractEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => Activity, (activity) => activity.categories)
  activities: Activity[];
}
