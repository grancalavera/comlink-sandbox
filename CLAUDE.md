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
- When completing a task always smoke test it manually to ensure it works as expected.
- When saying "complete the current task" it means to smoke test it manually, then if all is fine move it to the completed directory, and finally committing your changes.
- When saying "begin the next task" it means picking up the next task (top in the list) from the backlog, creating the current directory, adding the task as specified in @CLAUDE.md and then making a commit before starting any code changes. If when you try to begin the next task there's still a current task in progress, stop and don't do any changes and just let me know.
- When saying "put the current task on hold" it means you need to follow the workflow to put the task on-hold, and commit all the current changes.

## Markdown Formatting Reminders

- ALWAYS add empty line after headers.
- ALWAYS add empty lines around lists.
- ALWAYS add empty lines around code blocks.
- ALWAYS end files with single newline.

## Testing Best Practices

### data-testid Usage

Only add `data-testid` attributes to elements that are:

- **Interactive elements**: buttons, inputs, links, switches, selects, etc. that users click, type in, or interact with.
- **Content assertions**: text/status elements that tests need to verify specific content (e.g., status messages, counters, dynamic values).

Do NOT add `data-testid` to:

- **Structural/layout elements**: containers, headers, sections, cards, divs used purely for styling/layout.
- **Static content**: titles, labels, static text that doesn't change based on application state.

This keeps the DOM clean and focuses test selectors on meaningful interactions and assertions.

## Task Management System

### Structure

```text
tasks/
├── current/           # Active task directory
│   └── README.md      # Task description and checklist
├── backlog.md         # Simple bullet list of future tasks
├── completed/         # Archive of completed task directories
│   ├── 2025-08-02-remove-vite-template-files/
│   │   └── README.md
│   ├── 2025-08-02-unit-test-setup-vitest/
│   │   └── README.md
│   └── ...
└── on-hold/           # Tasks that cannot be completed or are paused
    ├── 2025-08-03-task-name/
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
4. **On-hold**: When a task cannot be completed or we want to work on another task, move entire `tasks/current/` directory to `tasks/on-hold/YYYY-MM-DD-task-name/` with reason noted in README.md.
5. **Repeat**: Take next item from backlog.

### Backlog Format

- Simple bullet list in `backlog.md`.
- First item = next task.

### Task Directory Format

Each task directory contains:

- **README.md**: Title, description, and checklist.
- Any additional files can be placed directly in the task directory.
- Relative links within task directories remain intact when moved.