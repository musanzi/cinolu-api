import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '@/core/helpers/abstract.entity';
import { Program } from '@/features/programs/entities/program.entity';
import { Project } from '@/features/projects/entities/project.entity';
import { Event } from '@/features/events/entities/event.entity';

@Entity()
export class Subprogram extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_highlighted: boolean;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  is_published: boolean;

  @ManyToOne(() => Program, (p) => p.subprograms)
  @JoinColumn()
  program: Program;

  @OneToMany(() => Project, (p) => p.program)
  projects: Project[];

  @OneToMany(() => Event, (e) => e.program)
  events: Event[];
}
