import { Participation } from '../../entities';

export class ParticipationStatusChangedEvent {
  constructor(public readonly participation: Participation) {}
}
