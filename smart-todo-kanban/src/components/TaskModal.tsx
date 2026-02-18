import type { TaskPriority, TaskStatus } from '../types/task';
import { PRIORITY_LABELS, STATUS_LABELS } from '../types/task';
import { TASK_PRIORITIES, TASK_STATUSES } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { useTaskForm } from '../hooks/useTaskForm';

export function TaskModal() {
  const {
    isModalOpen,
    editingTask,
    saveTask,
    updateTaskAndClose,
    closeModal,
  } = useTasks();

  const {
    form,
    labelInput,
    setLabelInput,
    isEdit,
    handleSubmit,
    addLabel,
    removeLabel,
    updateField,
  } = useTaskForm({
    task: editingTask,
    isOpen: isModalOpen,
    onSave: saveTask,
    onUpdate: updateTaskAndClose,
    onClose: closeModal,
  });

  if (!isModalOpen) return null;

  return (
    <div className="panel-overlay" onClick={closeModal} role="presentation">
      <aside
        className="task-form-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <div className="task-form-panel__header">
          <h2 id="task-form-title">{isEdit ? 'Edit task' : 'New task'}</h2>
          <button
            type="button"
            className="task-form-panel__close"
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-field">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Task title"
              required
              autoFocus
            />
          </div>
          <div className="form-field">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={form.description ?? ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          <div className="form-field">
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={form.status}
              onChange={(e) => updateField('status', e.target.value as TaskStatus)}
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={form.priority}
              onChange={(e) => updateField('priority', e.target.value as TaskPriority)}
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="task-due">Due date</label>
            <input
              id="task-due"
              type="date"
              value={form.dueDate?.slice(0, 10) ?? ''}
              onChange={(e) =>
                updateField(
                  'dueDate',
                  e.target.value ? `${e.target.value}T23:59:59.000Z` : undefined
                )
              }
            />
          </div>
          <div className="form-field">
            <label>Labels</label>
            <div className="label-input-row">
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                placeholder="Add label"
              />
              <button type="button" className="btn btn--secondary" onClick={addLabel}>
                Add
              </button>
            </div>
            {form.labels.length > 0 && (
              <div className="label-chips">
                {form.labels.map((l) => (
                  <span key={l} className="label-chip">
                    {l}
                    <button
                      type="button"
                      onClick={() => removeLabel(l)}
                      aria-label={`Remove ${l}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="task-form__actions">
            <button type="button" className="btn btn--ghost" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
