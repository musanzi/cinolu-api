import slugify from 'slugify';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Activity } from '../entities/activity.entity';

@EventSubscriber()
export class ActivitySubscriber implements EntitySubscriberInterface<Activity> {
  listenTo() {
    return Activity;
  }

  beforeInsert(event: InsertEvent<Activity>): void {
    event.entity.slug = this.createSlug(event.entity.name);
  }

  beforeUpdate(event: UpdateEvent<Activity>): void {
    if (!event.entity?.name) return;
    event.entity.slug = this.createSlug(event.entity.name);
  }

  private createSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, trim: true });
  }
}
