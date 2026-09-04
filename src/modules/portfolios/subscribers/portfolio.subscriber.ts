import slugify from 'slugify';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Portfolio } from '../entities/portfolio.entity';

@EventSubscriber()
export class PortfolioSubscriber implements EntitySubscriberInterface<Portfolio> {
  listenTo() {
    return Portfolio;
  }

  beforeInsert(event: InsertEvent<Portfolio>): void {
    event.entity.slug = this.createSlug(event.entity.name);
  }

  beforeUpdate(event: UpdateEvent<Portfolio>): void {
    if (!event.entity?.name) return;
    event.entity.slug = this.createSlug(event.entity.name);
  }

  private createSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, trim: true });
  }
}
