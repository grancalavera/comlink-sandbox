# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture & Tech Stack

- **React 19** with TypeScript in strict mode.
- **Vite** build tool with SWC for fast refresh.
- **ESLint** with TypeScript, React hooks, and React refresh plugins.
- ES modules (type: "module" in package.json).
- Modern TypeScript config with bundler resolution and verbatim module syntax.
- JSX transform uses react-jsx (no React import needed).
- TypeScript strict mode with no unused locals/parameters.

## Commands

- `npm run dev` - Start development server (assume it's running).
- `npm run build` - Build for production (runs TypeScript check + Vite build).
- `npm run lint` - Run ESLint.
- `npm run preview` - Preview production build.
- No test framework configured.

## Development Etiquette

- Don't start dev server, assume it's running.
- When working on tasks, update the current task file with progress.
- Always leave an empty line after markdown headers.
- Always end sentences and bullet point items with a period.
- When starting new tasks from the backlog, just move the task from the backlog and draft some actions but do not write any code.
- Always add empty lines around markdown lists.

## Task Management System

### Structure

```text
tasks/
├── current/           # Active task directory
│   └── README.md      # Task description and checklist
├── backlog.md         # Simple bullet list of future tasks
└── completed/         # Archive of completed task directories
    ├── 2025-08-02-remove-vite-template-files/
    │   └── README.md
    ├── 2025-08-02-unit-test-setup-vitest/
    │   └── README.md
    └── ...
```

### Workflow

1. **Start**: Take first item from backlog list, create `tasks/current/` directory with README.md:
   - Title: The text of the item in the backlog.
   - Description: Best guess at what needs to be done.
   - Checklist: Placeholders for sub-tasks.
2. **Work**: Update checklist in `tasks/current/README.md` as we progress.
3. **Complete**: Move entire `tasks/current/` directory to `tasks/completed/YYYY-MM-DD-task-name/`.
4. **Repeat**: Take next item from backlog.

### Backlog Format

- Simple bullet list in `backlog.md`.
- First item = next task.

### Task Directory Format

Each task directory contains:

- **README.md**: Title, description, and checklist.
- Any additional files can be placed directly in the task directory.
- Relative links within task directories remain intact when moved.