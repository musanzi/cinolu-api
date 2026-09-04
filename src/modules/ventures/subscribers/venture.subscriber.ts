import slugify from 'slugify';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Venture } from '../entities';

@EventSubscriber()
export class VentureSubscriber implements EntitySubscriberInterface<Venture> {
  listenTo() {
    return Venture;
  }

  beforeInsert(event: InsertEvent<Venture>): void {
    event.entity.slug = this.createSlug(event.entity.name);
  }

  beforeUpdate(event: UpdateEvent<Venture>): void {
    if (!event.entity?.name) return;
    event.entity.slug = this.createSlug(event.entity.name);
  }

  private createSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, trim: true });
  }
}
