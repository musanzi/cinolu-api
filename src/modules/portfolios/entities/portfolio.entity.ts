import { AbstractEntity } from '@/shared/abstracts';
import { Column, Entity, OneToMany } from 'typeorm';
import { Program } from '@/modules/programs/entities/program.entity';

@Entity()
export class Portfolio extends AbstractEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @OneToMany(() => Program, (program) => program.portfolio)
  programs: Program[];
}
