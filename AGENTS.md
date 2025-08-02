# Agent Guidelines for comlink-sandbox

## Build Commands

- `npm run dev` - Start development server (assume it's running)
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- No test framework configured

## Code Style

- **Language**: TypeScript with strict mode enabled
- **Framework**: React 19 with Vite + SWC
- **Imports**: ES modules, prefer named imports, use .tsx extension
- **Formatting**: ESLint with TypeScript-ESLint + React hooks rules
- **Types**: Strict TypeScript, no unused locals/parameters, explicit return types preferred
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Components**: Function declarations, default exports, JSX with react-jsx transform
- **Error Handling**: Use TypeScript strict mode, non-null assertions with !

## Agent Etiquette

- Don't start dev server, assume it's running. Ask if testing needed and server not running.
- When working on the project plan (PROJECT.md), only modify PROJECT.md and don't write any code or modify other files.
