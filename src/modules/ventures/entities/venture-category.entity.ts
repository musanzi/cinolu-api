import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Venture } from './venture.entity';

@Entity()
export class VentureCategory extends AbstractEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ManyToMany(() => Venture, (venture) => venture.categories)
  ventures: Venture[];
}
