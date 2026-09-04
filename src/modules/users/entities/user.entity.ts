import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { AbstractEntity } from '@/shared/abstracts';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
