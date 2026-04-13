import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '@/core/helpers/abstract.entity';
import { User } from '@/features/users/entities/user.entity';
import { ProjectParticipation } from '@/features/projects/entities/project-participation.entity';

@Entity()
@Unique(['user', 'participation'])
export class ProjectParticipationUpvote extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.project_participation_upvotes)
  @JoinColumn()
  user: User;

  @ManyToOne(() => ProjectParticipation, (participation) => participation.upvotes)
  @JoinColumn()
  participation: ProjectParticipation;
}
