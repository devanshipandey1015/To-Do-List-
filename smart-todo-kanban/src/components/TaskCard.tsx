import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types/task';
import { PRIORITY_LABELS } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-card__header">
        <span className={`task-card__priority task-card__priority--${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <div className="task-card__actions">
          <button
            type="button"
            className="task-card__btn task-card__btn--edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            type="button"
            className="task-card__btn task-card__btn--delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
      <h3 className="task-card__title">{task.title}</h3>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
      {task.labels.length > 0 && (
        <div className="task-card__labels">
          {task.labels.map((l) => (
            <span key={l} className="task-card__label">{l}</span>
          ))}
        </div>
      )}
      {dueLabel && (
        <div className="task-card__due">
          <span className="task-card__due-label">Due:</span> {dueLabel}
        </div>
      )}
    </div>
  );
}
