# Clean up unnecessary data-testids across components

## Description

Remove excessive data-testid attributes from structural/layout elements while keeping them only on interactive elements and content that needs assertions. This follows best practices by keeping the DOM clean and focusing test selectors on meaningful interactions.

## Checklist

- [x] Audit all existing data-testids across the application.
- [x] Clean up unnecessary data-testids in ClientApp component (reduced from 9 to 4).
- [x] Clean up unnecessary data-testids in Dashboard component (reduced from 7 to 2).
- [x] Document data-testid best practices in CLAUDE.md.
- [x] Verify application still builds and passes lint checks.

## Test ID Naming Convention

Follow the `component-element-action` or `component-element` format:

- **Components**: Use kebab-case component name as prefix (e.g., `dashboard-`, `client-app-`)
- **Elements**: Describe the element type or purpose (e.g., `header`, `button`, `container`)
- **Actions**: Include action when applicable (e.g., `close-btn`, `add-client-btn`)

### Examples

- `dashboard-container` - Main dashboard container
- `dashboard-add-client-btn` - Button to add new client
- `client-app-connection-switch` - Toggle switch for connection status
- `client-app-close-btn` - Button to close client

### Interactive Elements

All interactive elements (buttons, inputs, switches, links) should have data-testid attributes to enable reliable automated testing without depending on implementation details like CSS classes or text content.
