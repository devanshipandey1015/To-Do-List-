import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../types/task';
import { STATUS_LABELS } from '../types/task';
import { TaskCard } from './TaskCard';

export interface ColumnProps {
  id: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function Column({ id, status, tasks, onEdit, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'kanban-column--over' : ''}`}
    >
      <h3 className="kanban-column__title">{STATUS_LABELS[status]}</h3>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="kanban-column__cards">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
      {isOver && (
        <div className="kanban-column__drop-indicator" aria-hidden>
          <span className="kanban-column__drop-text">Drop here</span>
        </div>
      )}
    </div>
  );
}
