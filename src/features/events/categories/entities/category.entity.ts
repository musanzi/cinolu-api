import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '@/core/helpers/abstract.entity';
import { Event } from '../../entities/event.entity';

@Entity()
export class EventCategory extends AbstractEntity {
  @Column()
  name: string;

  @ManyToMany(() => Event, (event) => event.categories)
  events: Event[];
}
