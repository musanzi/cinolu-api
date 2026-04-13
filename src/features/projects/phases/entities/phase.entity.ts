import { AbstractEntity } from '@/core/helpers/abstract.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '@/features/projects/entities/project.entity';
import { ProjectParticipation } from '@/features/projects/entities/project-participation.entity';
import { Deliverable } from '@/features/projects/phases/deliverables/entities/deliverable.entity';
import { MentorProfile } from '@/features/mentors/entities/mentor.entity';
import { Resource } from '@/features/projects/resources/entities/resource.entity';
import { ProjectParticipationReview } from '@/features/projects/entities/project-participation-review.entity';

@Entity()
export class Phase extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  started_at: Date;

  @Column()
  ended_at: Date;

  @ManyToOne(() => Project, (project) => project.phases)
  @JoinColumn()
  project: Project;

  @ManyToMany(() => ProjectParticipation, (participation) => participation.phases)
  participations: ProjectParticipation[];

  @ManyToMany(() => MentorProfile, (mentor) => mentor.phases)
  @JoinTable()
  mentors: MentorProfile[];

  @OneToMany(() => Deliverable, (deliverable) => deliverable.phase)
  deliverables: Deliverable[];

  @OneToMany(() => Resource, (resource) => resource.phase)
  resources: Resource[];

  @OneToMany(() => ProjectParticipationReview, (review) => review.phase)
  reviews: ProjectParticipationReview[];
}
