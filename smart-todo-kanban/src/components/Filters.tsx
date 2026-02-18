import type { TaskPriority } from '../types/task';
import { PRIORITY_LABELS } from '../types/task';
import type { DueFilter } from '../types/filters';

export interface FiltersProps {
  priority: TaskPriority | '';
  onPriorityChange: (value: TaskPriority | '') => void;
  labelFilter: string;
  onLabelFilterChange: (value: string) => void;
  dueFilter: DueFilter;
  onDueFilterChange: (value: DueFilter) => void;
  availableLabels: string[];
}

export function Filters({
  priority,
  onPriorityChange,
  labelFilter,
  onLabelFilterChange,
  dueFilter,
  onDueFilterChange,
  availableLabels,
}: FiltersProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="filter-priority" className="filter-label">
          Priority
        </label>
        <select
          id="filter-priority"
          className="filter-select"
          value={priority}
          onChange={(e) => onPriorityChange((e.target.value || '') as TaskPriority | '')}
        >
          <option value="">All</option>
          {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="filter-label" className="filter-label">
          Label
        </label>
        <select
          id="filter-label"
          className="filter-select"
          value={labelFilter}
          onChange={(e) => onLabelFilterChange(e.target.value)}
        >
          <option value="">All</option>
          {availableLabels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="filter-due" className="filter-label">
          Due date
        </label>
        <select
          id="filter-due"
          className="filter-select"
          value={dueFilter}
          onChange={(e) => onDueFilterChange(e.target.value as DueFilter)}
        >
          <option value="any">Any</option>
          <option value="today">Today</option>
          <option value="this_week">This week</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
    </div>
  );
}
