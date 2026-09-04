import slugify from 'slugify';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Program } from '../entities/program.entity';

@EventSubscriber()
export class ProgramSubscriber implements EntitySubscriberInterface<Program> {
  listenTo() {
    return Program;
  }

  beforeInsert(event: InsertEvent<Program>): void {
    event.entity.slug = this.createSlug(event.entity.name);
  }

  beforeUpdate(event: UpdateEvent<Program>): void {
    if (!event.entity?.name) return;
    event.entity.slug = this.createSlug(event.entity.name);
  }

  private createSlug(name: string): string {
    return slugify(name, { lower: true, strict: true, trim: true });
  }
}
