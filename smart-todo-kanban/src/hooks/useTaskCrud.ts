import { useCallback, useEffect, useState } from 'react';
import { loadTasks, saveTasks } from '../lib/storage';
import type { Task, TaskFormData, TaskStatus } from '../types/task';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function useTaskCrud() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || loadTasks().length > 0) saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((data: TaskFormData): Task => {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [...prev, task]);
    return task;
  }, []);

  const updateTask = useCallback(
    (id: string, data: Partial<TaskFormData> & { status?: TaskStatus }) => {
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data, updatedAt: now } : t))
      );
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updatedAt: now } : t))
    );
  }, []);

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks]
  );

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTask,
  };
}
