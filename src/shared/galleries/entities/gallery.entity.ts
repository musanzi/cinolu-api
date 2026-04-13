import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from '@/features/blog/articles/entities/article.entity';
import { Project } from '@/features/projects/entities/project.entity';
import { Event } from '@/features/events/entities/event.entity';
import { AbstractEntity } from '@/core/helpers/abstract.entity';
import { Venture } from '@/features/ventures/entities/venture.entity';
import { Product } from '@/features/ventures/products/entities/product.entity';

@Entity()
export class Gallery extends AbstractEntity {
  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Project)
  @JoinColumn()
  project: Project;

  @ManyToOne(() => Event)
  @JoinColumn()
  event: Event;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Venture)
  @JoinColumn()
  venture: Venture;

  @ManyToOne(() => Article)
  @JoinColumn()
  article: Article;
}
