import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { filterTasks, getUniqueLabels } from '../lib/filters';
import { loadTheme, saveTheme, type Theme } from '../lib/storage';
import { useTaskCrud } from '../hooks/useTaskCrud';
import type { FilterState } from '../types/filters';
import type { Task, TaskFormData, TaskStatus } from '../types/task';

export interface TaskContextValue {
  tasks: Task[];
  filteredTasks: Task[];
  getTask: (id: string) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  addTask: (data: TaskFormData) => Task;
  updateTask: (id: string, data: Partial<TaskFormData> & { status?: TaskStatus }) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  filters: FilterState;
  setSearchQuery: (q: string) => void;
  setPriorityFilter: (p: FilterState['priority']) => void;
  setLabelFilter: (label: string) => void;
  setDueFilter: (due: FilterState['due']) => void;
  availableLabels: string[];
  isModalOpen: boolean;
  editingTask: Task | null;
  openModal: (taskId: string | null) => void;
  closeModal: () => void;
  saveTask: (data: TaskFormData) => void;
  updateTaskAndClose: (id: string, data: Partial<TaskFormData> & { status?: TaskStatus }) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

const initialFilters: FilterState = {
  searchQuery: '',
  priority: '',
  label: '',
  due: 'any',
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTask,
  } = useTaskCrud();

  const [theme, setThemeState] = useState<Theme>('light');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setThemeState(loadTheme());
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    saveTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      saveTheme(next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setFilters((f) => ({ ...f, searchQuery: q }));
  }, []);

  const setPriorityFilter = useCallback((p: FilterState['priority']) => {
    setFilters((f) => ({ ...f, priority: p }));
  }, []);

  const setLabelFilter = useCallback((label: string) => {
    setFilters((f) => ({ ...f, label }));
  }, []);

  const setDueFilter = useCallback((due: FilterState['due']) => {
    setFilters((f) => ({ ...f, due }));
  }, []);

  const filteredTasks = useMemo(
    () =>
      filterTasks(tasks, filters.searchQuery, filters.priority, filters.label, filters.due),
    [tasks, filters]
  );

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => filteredTasks.filter((t) => t.status === status),
    [filteredTasks]
  );

  const availableLabels = useMemo(() => getUniqueLabels(tasks), [tasks]);
  const editingTask = editingTaskId ? getTask(editingTaskId) ?? null : null;
  const openModal = useCallback((taskId: string | null) => {
    setEditingTaskId(taskId);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingTaskId(null);
  }, []);

  const saveTask = useCallback((data: TaskFormData) => {
    addTask(data);
    closeModal();
  }, [addTask, closeModal]);

  const updateTaskAndClose = useCallback((id: string, data: Partial<TaskFormData> & { status?: TaskStatus }) => {
    updateTask(id, data);
    closeModal();
  }, [updateTask, closeModal]);

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      filteredTasks,
      getTask,
      getTasksByStatus,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      theme,
      setTheme,
      toggleTheme,
      filters,
      setSearchQuery,
      setPriorityFilter,
      setLabelFilter,
      setDueFilter,
      availableLabels,
      isModalOpen,
      editingTask,
      openModal,
      closeModal,
      saveTask,
      updateTaskAndClose,
    }),
    [
      tasks,
      filteredTasks,
      getTask,
      getTasksByStatus,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      theme,
      setTheme,
      toggleTheme,
      filters,
      setSearchQuery,
      setPriorityFilter,
      setLabelFilter,
      setDueFilter,
      availableLabels,
      isModalOpen,
      editingTask,
      openModal,
      closeModal,
      saveTask,
      updateTaskAndClose,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
