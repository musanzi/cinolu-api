import { IPagination } from '@/shared/interfaces';

export interface IFilterReviews extends IPagination {
  q?: string;
}

export interface IReviewAnswerStatistic {
  value: string;
  count: number;
}

export interface IReviewQuestionStatistic {
  question: string;
  answered: number;
  answers: IReviewAnswerStatistic[];
}

export interface IReviewStatistics {
  totalReviews: number;
  firstSubmitDate: Date | null;
  lastSubmitDate: Date | null;
  questions: IReviewQuestionStatistic[];
}
