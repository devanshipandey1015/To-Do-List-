import { TaskProvider, useTasks } from './context/TaskContext';
import { Filters } from './components/Filters';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskModal } from './components/TaskModal';

function AppContent() {
  const {
    theme,
    toggleTheme,
    filters,
    setSearchQuery,
    setPriorityFilter,
    setLabelFilter,
    setDueFilter,
    availableLabels,
    filteredTasks,
    getTasksByStatus,
    moveTask,
    deleteTask,
    openModal,
  } = useTasks();

  return (
    <div className="app">
      <div className="app__container">
        <Header
          searchQuery={filters.searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        <div className="app-toolbar">
          <Filters
            priority={filters.priority}
            onPriorityChange={setPriorityFilter}
            labelFilter={filters.label}
            onLabelFilterChange={setLabelFilter}
            dueFilter={filters.due}
            onDueFilterChange={setDueFilter}
            availableLabels={availableLabels}
          />
          <button
            type="button"
            className="btn btn--primary btn--add"
            onClick={() => openModal(null)}
          >
            + Add task
          </button>
        </div>
        <main className="app-main">
          <KanbanBoard
            tasks={filteredTasks}
            getTasksByStatus={getTasksByStatus}
            onMoveTask={moveTask}
            onEdit={(t) => openModal(t.id)}
            onDelete={deleteTask}
          />
        </main>
      </div>
      <TaskModal />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}
