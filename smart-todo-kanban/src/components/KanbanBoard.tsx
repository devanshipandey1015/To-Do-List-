import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { Task, TaskStatus } from '../types/task';
import { PRIORITY_LABELS, TASK_STATUSES } from '../types/task';
import { Column } from './Column';

const COLUMN_IDS = TASK_STATUSES;

/** Resolve drop target to a column status; null if invalid or same-task drop. */
function resolveNewStatus(overId: string, tasks: Task[]): TaskStatus | null {
  const statusFromDroppable = COLUMN_IDS.find((s) => `droppable-${s}` === overId);
  if (statusFromDroppable) return statusFromDroppable;
  const overTask = tasks.find((t) => t.id === overId);
  return overTask?.status ?? null;
}

export interface KanbanBoardProps {
  tasks: Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  onMoveTask: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function DragOverlayContent({ task }: { task: Task }) {
  return (
    <div className="task-card task-card--overlay">
      <div className="task-card__header">
        <span className={`task-card__priority task-card__priority--${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      <h3 className="task-card__title">{task.title}</h3>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
    </div>
  );
}

export function KanbanBoard({
  tasks,
  getTasksByStatus,
  onMoveTask,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 12 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 260, tolerance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    const taskId = String(active.id);
    const overId = String(over.id);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = resolveNewStatus(overId, tasks);
    if (newStatus != null && newStatus !== task.status) {
      onMoveTask(taskId, newStatus);
    }
  };

  const dropAnimationConfig = {
    duration: 200,
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {COLUMN_IDS.map((status) => (
          <Column
            key={status}
            id={`droppable-${status}`}
            status={status}
            tasks={getTasksByStatus(status)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeTask ? <DragOverlayContent task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
