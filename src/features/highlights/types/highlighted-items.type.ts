import { Article } from '@/features/blog/articles/entities/article.entity';
import { Event } from '@/features/events/entities/event.entity';
import { Program } from '@/features/programs/entities/program.entity';
import { Project } from '@/features/projects/entities/project.entity';
import { Subprogram } from '@/features/subprograms/entities/subprogram.entity';

export interface HighlightedItems {
  programs: Program[];
  subprograms: Subprogram[];
  events: Event[];
  projects: Project[];
  articles: Article[];
}
