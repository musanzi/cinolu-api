import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { AbstractEntity } from '@/shared/abstracts';
import { UserSocialLinks } from '../interfaces';
import { Venture } from '@/modules/ventures/entities';

@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

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
}
