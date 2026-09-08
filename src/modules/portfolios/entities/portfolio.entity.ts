import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity } from 'typeorm';

@Entity()
export class Portfolio extends AbstractEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;
}
