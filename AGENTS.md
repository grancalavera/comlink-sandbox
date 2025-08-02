# Agent Guidelines for comlink-sandbox

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
├── current/           # Active task directory
│   ├── README.md      # Task description and checklist
│   └── assets/        # Any related files, screenshots, etc.
├── backlog.md         # Simple bullet list of future tasks
└── completed/         # Archive of completed task directories
    ├── 2025-08-02-remove-vite-template-files/
    └── 2025-08-02-unit-test-setup-vitest/
```

### Workflow

1. **Start**: Take first item from backlog, create `tasks/current/` directory with README.md
2. **Work**: Update checklist in `tasks/current/README.md` as we progress
3. **Complete**: Move entire `tasks/current/` directory to `tasks/completed/YYYY-MM-DD-task-name/`
4. **Repeat**: Take next item from backlog

### Task Directory Format

- **README.md**: Title, description, and checklist
- **assets/**: Related files with relative links that stay intact when moved
