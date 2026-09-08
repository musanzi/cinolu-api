import { User } from '@/modules/users/entities';
import { Category } from '@/modules/categories/entities';
import { Type } from '@/modules/types/entities';
import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { ActivityForm } from '../interfaces';

@Entity()
export class Activity extends AbstractEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  participationForm: ActivityForm;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  reviewForm: ActivityForm;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cover?: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'activity_mentors' })
  mentors: User[];

  @ManyToMany(() => Type, (type) => type.activities)
  @JoinTable({ name: 'activity_activity_types' })
  types: Type[];

  @ManyToMany(() => Category, (category) => category.activities)
  @JoinTable({ name: 'activity_categories' })
  categories: Category[];
}
