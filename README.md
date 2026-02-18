# Smart Todo Kanban
<img width="1910" height="909" alt="image" src="https://github.com/user-attachments/assets/685403a2-088b-421c-8fc2-2b23820e70fd" />


A lightweight Kanban-style todo app built with Vite, React, and TypeScript. All data is stored in the browser via `localStorage`—no backend required.

## Features

- **Kanban board** – Three columns: Backlog, In Progress, Done
- **Tasks** – Full task model: title, description, status, priority, labels, optional due date
- **CRUD** – Add, edit, and delete tasks via a slide-out panel form
- **Drag and drop** – Move tasks between columns with [@dnd-kit](https://dndkit.com/)
- **Search** – Filter by task title and description
- **Filters** – By priority, label, and due date (Today, This week, Overdue)
- **Dark mode** – Toggle with persistence in `localStorage`
- **Responsive layout** – Usable on desktop and mobile; columns stack on small screens
- **Persistence** – Safe `localStorage` read/write with parsing fallbacks and validation

## Tech stack

- **Vite** – Build tool and dev server
- **React 19** – UI
- **TypeScript** – Typing and task model
- **@dnd-kit (core, sortable, utilities)** – Accessible drag and drop
- **CSS** – Custom SaaS-style theme with CSS variables and dark mode

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build   # Production build
npm run preview # Preview production build
```

## Project structure

```
src/
  components/   # Header, FilterBar, KanbanBoard, TaskCard, TaskForm
  context/      # TaskProvider + useTasks (state + localStorage sync)
  lib/          # storage (localStorage), filters (search + filters)
  types/        # Task and related types
  App.tsx
  main.tsx
  index.css
```

## Future improvements

- **Reorder within column** – Sortable list per column (e.g. drag to reorder in Backlog)
- **Keyboard shortcuts** – Quick add (e.g. `N`), search focus (`/`), close panel (`Escape`)
- **Bulk actions** – Multi-select and move/delete
- **Export/import** – JSON backup and restore
- **Recurring tasks** – Due date repetition (daily, weekly)
- **Subtasks** – Checklist inside a task
- **Backend option** – Optional sync to a simple API or PWA + IndexedDB for larger data
