import { Activity } from '@/modules/activities/entities';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('activity_category')
export class Category extends AbstractEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => Activity, (activity) => activity.categories)
  activities: Activity[];
}
