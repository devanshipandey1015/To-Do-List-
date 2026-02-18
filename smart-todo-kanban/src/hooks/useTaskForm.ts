import { useEffect, useState } from 'react';
import type { Task, TaskFormData, TaskStatus } from '../types/task';

const defaultForm: TaskFormData = {
  title: '',
  description: '',
  status: 'backlog',
  priority: 'medium',
  labels: [],
  dueDate: undefined,
};

export interface UseTaskFormArgs {
  task: Task | null;
  isOpen: boolean;
  onSave: (data: TaskFormData) => void;
  onUpdate: (id: string, data: Partial<TaskFormData> & { status?: TaskStatus }) => void;
  onClose: () => void;
}

export function useTaskForm({ task, isOpen, onSave, onUpdate, onClose }: UseTaskFormArgs) {
  const [form, setForm] = useState<TaskFormData>(defaultForm);
  const [labelInput, setLabelInput] = useState('');

  const isEdit = Boolean(task?.id);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        labels: [...task.labels],
        dueDate: task.dueDate ?? undefined,
      });
    } else {
      setForm({ ...defaultForm });
    }
    setLabelInput('');
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) return;
    const data: TaskFormData = {
      ...form,
      title: trimmedTitle,
      description: form.description?.trim() || undefined,
      labels: form.labels.filter(Boolean),
      dueDate: form.dueDate || undefined,
    };
    if (isEdit && task) {
      onUpdate(task.id, data);
    } else {
      onSave(data);
    }
    onClose();
  };

  const addLabel = () => {
    const label = labelInput.trim();
    if (label && !form.labels.includes(label)) {
      setForm((prev) => ({ ...prev, labels: [...prev.labels, label] }));
      setLabelInput('');
    }
  };

  const removeLabel = (label: string) => {
    setForm((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l !== label),
    }));
  };

  const updateField = <K extends keyof TaskFormData>(
    key: K,
    value: TaskFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return {
    form,
    labelInput,
    setLabelInput,
    isEdit,
    handleSubmit,
    addLabel,
    removeLabel,
    updateField,
  };
}
