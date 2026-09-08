import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity } from 'typeorm';

@Entity()
export class Sector extends AbstractEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;
}
