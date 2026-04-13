import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '@/core/helpers/abstract.entity';
import { Project } from '../../entities/project.entity';

@Entity()
export class ProjectCategory extends AbstractEntity {
  @Column()
  name: string;

  @ManyToMany(() => Project, (program) => program.categories)
  projects: Project[];
}
