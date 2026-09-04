import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { format } from 'fast-csv';
import { ExportParticipationsCsv, FindActivityParticipations } from '../impl';

@QueryHandler(ExportParticipationsCsv)
export class ExportParticipationsCsvHandler implements IQueryHandler<ExportParticipationsCsv, void> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: ExportParticipationsCsv): Promise<void> {
    const items = [];
    let page = 1;

    while (true) {
      const [batch] = await this.queryBus.execute(
        new FindActivityParticipations(query.actor, query.activityId, { ...query.params, page, limit: 100 })
      );

      items.push(...batch);

      if (batch.length < 100) break;

      page += 1;
    }

    query.response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    query.response.setHeader('Content-Disposition', `attachment; filename="participations-${query.activityId}.csv"`);

    const csv = format({ headers: ['Name', 'Email', 'Status', 'Submit date', 'Responses'] });

    csv.pipe(query.response);

    items.forEach((item) =>
      csv.write({
        Name: item.user.name,
        Email: item.user.email,
        Status: item.status,
        'Submit date': item.submitDate.toISOString(),
        Responses: JSON.stringify(item.responses)
      })
    );

    csv.end();
  }
}
