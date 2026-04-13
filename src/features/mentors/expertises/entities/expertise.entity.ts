import { Entity, Column, ManyToMany } from 'typeorm';
import { AbstractEntity } from '@/core/helpers/abstract.entity';
import { MentorProfile } from '../../entities/mentor.entity';

@Entity()
export class Expertise extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => MentorProfile, (mp) => mp.expertises)
  mentors_profiles: MentorProfile[];
}
