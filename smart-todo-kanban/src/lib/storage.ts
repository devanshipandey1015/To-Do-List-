import type { Task } from '../types/task';

const STORAGE_KEY = 'smart-todo-kanban-tasks';
const STORAGE_VERSION = 1;

/** Versioned payload so we can migrate or ignore old/corrupted data */
interface TasksPayload {
  version: number;
  tasks: unknown;
}

const EMPTY_TASKS: Task[] = [];

/**
 * Safe JSON parse: never throws. Returns fallback for invalid input or parse errors.
 */
function safeJsonParse<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (trimmed === '') return fallback;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Safe localStorage get: never throws. Returns null if unavailable or error.
 */
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safe localStorage set: never throws. Silently ignores quota/disabled errors.
 */
function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage disabled, quota exceeded, or other error
  }
}

function isTaskArray(value: unknown): value is Task[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    return (
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      ['backlog', 'in_progress', 'done'].includes(item.status) &&
      ['low', 'medium', 'high'].includes(item.priority) &&
      Array.isArray(item.labels) &&
      typeof item.createdAt === 'string' &&
      typeof item.updatedAt === 'string'
    );
  });
}

function normalizeTask(raw: unknown): Task | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const title = typeof o.title === 'string' ? o.title : '';
  const status = ['backlog', 'in_progress', 'done'].includes(o.status as string)
    ? (o.status as Task['status'])
    : 'backlog';
  const priority = ['low', 'medium', 'high'].includes(o.priority as string)
    ? (o.priority as Task['priority'])
    : 'medium';
  const labels = Array.isArray(o.labels)
    ? (o.labels as string[]).filter((l) => typeof l === 'string')
    : [];
  if (!id || !title) return null;
  return {
    id,
    title,
    description: typeof o.description === 'string' ? o.description : undefined,
    status,
    priority,
    labels,
    dueDate: typeof o.dueDate === 'string' ? o.dueDate : undefined,
    createdAt: typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString(),
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : new Date().toISOString(),
  };
}

/**
 * Load tasks from localStorage. Never throws.
 * - Empty or missing storage → []
 * - Invalid/corrupted JSON → []
 * - Version mismatch or invalid payload shape → [] (corrupted data fallback)
 * - Invalid items in array → normalized or skipped, returns only valid tasks
 */
export function loadTasks(): Task[] {
  const raw = safeGetItem(STORAGE_KEY);
  if (raw == null || raw === '') return EMPTY_TASKS;

  const parsed = safeJsonParse<TasksPayload | unknown>(raw, null);
  if (parsed == null) return EMPTY_TASKS;

  // Versioned payload: { version, tasks }
  if (parsed && typeof parsed === 'object' && 'version' in parsed && 'tasks' in parsed) {
    const payload = parsed as TasksPayload;
    if (typeof payload.version !== 'number' || payload.version !== STORAGE_VERSION) {
      return EMPTY_TASKS;
    }
    const tasks = payload.tasks;
    if (isTaskArray(tasks)) return tasks;
    if (Array.isArray(tasks)) {
      const normalized = tasks.map(normalizeTask).filter((t): t is Task => t !== null);
      return normalized;
    }
    return EMPTY_TASKS;
  }

  // Legacy or malformed: try to treat as raw task array for backward compatibility
  if (isTaskArray(parsed)) return parsed;
  if (Array.isArray(parsed)) {
    const normalized = parsed.map(normalizeTask).filter((t): t is Task => t !== null);
    return normalized;
  }
  return EMPTY_TASKS;
}

/**
 * Save tasks to localStorage. Never throws.
 * Uses versioned payload so loadTasks can detect format and version.
 */
export function saveTasks(tasks: Task[]): void {
  if (!Array.isArray(tasks)) return;
  const payload: TasksPayload = { version: STORAGE_VERSION, tasks };
  const serialized = JSON.stringify(payload);
  safeSetItem(STORAGE_KEY, serialized);
}

const THEME_KEY = 'smart-todo-kanban-theme';

export type Theme = 'light' | 'dark';

/**
 * Load theme from localStorage. Never throws.
 * Empty or invalid value → 'light'.
 */
export function loadTheme(): Theme {
  const raw = safeGetItem(THEME_KEY);
  if (raw === 'dark' || raw === 'light') return raw;
  return 'light';
}

/**
 * Save theme to localStorage. Never throws.
 */
export function saveTheme(theme: Theme): void {
  if (theme !== 'light' && theme !== 'dark') return;
  safeSetItem(THEME_KEY, theme);
}
