import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { AbstractEntity } from '@/shared/abstracts';
import { UserSocialLinks } from '../interfaces';
import { Venture } from '@/modules/ventures/entities';
import { Participation } from '@/modules/participations/entities';
import { Review } from '@/modules/reviews/entities';

@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  jobTitle?: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ type: 'text' })
  biography: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  socialLinks: UserSocialLinks;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @OneToMany(() => Venture, (venture) => venture.owner)
  ventures: Venture[];

  @OneToMany(() => Participation, (participation) => participation.participant)
  participations: Participation[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviews: Review[];
}
