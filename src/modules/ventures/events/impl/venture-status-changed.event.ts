import { Venture } from '../../entities';

export class VentureStatusChangedEvent {
  constructor(public readonly venture: Venture) {}
}
