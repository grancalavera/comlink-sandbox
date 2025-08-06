# Configure yolo sandbox and Prettier integration

## Description

Set up the yolo sandbox configuration based on the claude-code-sandbox repository to enhance the development workflow and tooling. This task also incorporates Prettier configuration and unified code quality checking that was originally planned as a separate task.

## Checklist

- [x] Research the claude-code-sandbox repository structure and configuration
- [x] Identify relevant configurations and tools to integrate
- [x] Implement the yolo sandbox configuration
- [x] Test the configuration works as expected
- [x] Document any changes made
- [x] Add npm scripts for fixing formatting and linting issues

## Implementation Details

### Files Created/Modified

1. **DevContainer Configuration**:
   - `.devcontainer/Dockerfile` - Custom container with Node.js 24, git-delta, zsh, development tools
   - `.devcontainer/devcontainer.json` - Container configuration with VS Code extensions
   - `.devcontainer/setup-git.sh` - Git configuration with enhanced diff tools
   - `.devcontainer/setup-tools.sh` - Additional development tools setup

2. **Code Formatting**:
   - `.prettierrc` - Prettier configuration for consistent code formatting
   - `.prettierignore` - Files to ignore in formatting
   - Added Prettier to package.json dependencies and format scripts
   - Added unified `npm run check` command (lint + format:check + typecheck)
   - Added `npm run fix` command (lint:fix + format) and `npm run lint:fix` for auto-fixing issues

3. **VS Code Configuration**:
   - `.vscode/settings.json` - Workspace settings for format-on-save and code actions

4. **Documentation**:
   - `YOLO_SANDBOX.md` - Complete documentation of the yolo sandbox setup

### Testing Results

All configurations tested successfully:

- ✅ Prettier formatting check identifies files needing formatting
- ✅ ESLint runs without errors
- ✅ TypeScript type checking passes
- ✅ Package scripts work as expected
- ✅ Unified `npm run check` command works (combines lint + format:check + typecheck)
- ✅ Auto-fix commands work (`npm run fix` and `npm run lint:fix`)
