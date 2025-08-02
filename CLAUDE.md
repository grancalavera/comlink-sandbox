# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture & Tech Stack

- **React 19** with TypeScript in strict mode
- **Vite** build tool with SWC for fast refresh
- **ESLint** with TypeScript, React hooks, and React refresh plugins
- ES modules (type: "module" in package.json)
- Modern TypeScript config with bundler resolution and verbatim module syntax
- JSX transform uses react-jsx (no React import needed)
- TypeScript strict mode with no unused locals/parameters

## Commands

- `npm run dev` - Start development server (assume it's running)
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- No test framework configured

## Development Etiquette

- Don't start dev server, assume it's running
- When working on tasks, update the current task file with progress

## Task Management System

### Structure

```text
tasks/
├── current.md         # Active task (what we're working on now)
├── backlog.md         # Future tasks/ideas
└── completed/         # Archive of completed tasks
    ├── 2025-08-02-milestone-cleanup.md
    ├── 2025-08-03-feature-xyz.md
    └── ...
```

### Workflow

1. **Start**: Take first item from backlog list, convert it to task in `current.md`:
   - Title: The text of the item in the backlog.
   - Description: best guess at what needs to be done.
   - Checklist: Placeholders for sub-tasks.
2. **Work**: Update checklist in `current.md` as we progress
3. **Complete**: Move `current.md` to `completed/YYYY-MM-DD-task-name.md`
4. **Repeat**: Take next item from backlog

### Backlog Format

- Simple bullet list in `backlog.md`.
- First item = next task.

### Task File Format

Each task includes:

- **Title**: What we're working on
- **Description**: Clear overview of what needs to be done
- **Checklist**: Sub-tasks with checkboxes
