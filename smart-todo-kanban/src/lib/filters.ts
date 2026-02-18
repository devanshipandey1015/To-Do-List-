import type { Task } from '../types/task';
import type { DueFilter, FilterState } from '../types/filters';

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isThisWeek(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return d >= start && d < end;
}

function isOverdue(iso: string): boolean {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function filterTasks(
  tasks: Task[],
  searchQuery: string,
  priority: FilterState['priority'],
  labelFilter: string,
  dueFilter: DueFilter
): Task[] {
  let result = tasks;

  const q = searchQuery.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q)
    );
  }

  if (priority) {
    result = result.filter((t) => t.priority === priority);
  }

  if (labelFilter) {
    result = result.filter((t) => t.labels.includes(labelFilter));
  }

  if (dueFilter !== 'any') {
    result = result.filter((t) => {
      if (!t.dueDate) return false;
      switch (dueFilter) {
        case 'today':
          return isToday(t.dueDate);
        case 'this_week':
          return isThisWeek(t.dueDate);
        case 'overdue':
          return isOverdue(t.dueDate);
        default:
          return true;
      }
    });
  }

  return result;
}

export function getUniqueLabels(tasks: Task[]): string[] {
  const set = new Set<string>();
  tasks.forEach((t) => t.labels.forEach((l) => set.add(l)));
  return Array.from(set).sort();
}
