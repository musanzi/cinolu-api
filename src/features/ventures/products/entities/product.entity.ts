import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '@/core/helpers/abstract.entity';
import { Venture } from '../../entities/venture.entity';
import { Gallery } from '@/shared/galleries/entities/gallery.entity';

@Entity()
export class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => Venture, (venture) => venture.products)
  @JoinColumn()
  venture: Venture;

  @OneToMany(() => Gallery, (gallery) => gallery.product)
  gallery: Gallery[];
}
