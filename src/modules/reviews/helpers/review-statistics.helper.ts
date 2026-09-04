import { FormResponses } from '@/modules/activities/interfaces';
import { IReviewQuestionStatistic } from '../interfaces';

export function calculateQuestionStatistics(responses: FormResponses[]): IReviewQuestionStatistic[] {
  const questions = new Map<string, Map<string, number>>();

  for (const response of responses) {
    for (const [question, rawValue] of Object.entries(response)) {
      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      const counts = questions.get(question) ?? new Map<string, number>();

      values.forEach((value) => {
        const normalized = typeof value === 'string' ? value : JSON.stringify(value);

        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      });

      questions.set(question, counts);
    }
  }

  return [...questions.entries()].map(([question, counts]) => ({
    question,
    answered: [...counts.values()].reduce((total, count) => total + count, 0),
    answers: [...counts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
  }));
}
