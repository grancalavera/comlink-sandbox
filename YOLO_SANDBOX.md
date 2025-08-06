# Yolo Sandbox Configuration

This repository is configured with a "yolo sandbox" setup based on [claude-code-sandbox](https://github.com/grancalavera/claude-code-sandbox) for enhanced development experience and safe experimentation.

## Features

### DevContainer Setup

- Node.js 24 runtime environment
- Pre-configured VS Code extensions (ESLint, Prettier, GitLens)
- Automated setup scripts for Git and development tools
- Enhanced command history persistence

### Development Tools

- **Prettier**: Code formatting with consistent style
- **ESLint**: Code quality and consistency
- **Git Delta**: Enhanced diff viewing
- **fzf**: Fuzzy file finding
- **GitHub CLI**: GitHub integration

### Git Configuration

- Enhanced diff and merge tools using Delta
- Automatic rebase on pull
- Co-authored-by trailer support
- Rerere enabled for conflict resolution

## Usage

### With DevContainer

1. Install VS Code and the Dev Containers extension
2. Open the project in VS Code
3. Run "Dev Containers: Reopen in Container" from the command palette

### Local Development

- `npm run dev` - Start development server
- `npm run check` - Run all checks (lint + format:check + typecheck)
- `npm run fix` - Fix all auto-fixable issues (lint:fix + format)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Configuration Files

- `.devcontainer/Dockerfile` - Custom development container
- `.devcontainer/devcontainer.json` - DevContainer configuration
- `.devcontainer/setup-*.sh` - Container setup scripts
- `.prettierrc` - Prettier configuration
- `.vscode/settings.json` - VS Code workspace settings
- `YOLO_SANDBOX.md` - This documentation
