import type { TaskPriority } from './task';

export type DueFilter = 'any' | 'today' | 'this_week' | 'overdue';

export interface FilterState {
  searchQuery: string;
  priority: TaskPriority | '';
  label: string;
  due: DueFilter;
}
