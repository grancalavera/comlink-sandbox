# Add a client to the dashboard

## Description

Implement the functionality to dynamically add and display client instances within the dashboard using iframes, as described in the README. Clients are loaded as iframes pointing to the separate client entry point, with communication between dashboard and clients via postMessage API. Clients must be laid out from left to right in row-major order.

## Architecture

### iframe ↔ Parent Window Communication

- Use `window.postMessage` API for cross-frame communication
- Client iframe sends messages to parent dashboard when events occur
- Dashboard listens for messages and updates its state accordingly

### Client-side Implementation (in iframe)

```typescript
const handleClose = () => {
  window.parent.postMessage({
    type: 'CLOSE_CLIENT',
    clientId: client.id
  }, '*');
};
```

### Dashboard-side Implementation (parent window)

```typescript
useEffect(() => {
  const handleClientMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    
    const { type, clientId } = event.data;
    if (type === 'CLOSE_CLIENT') {
      removeClient(clientId);
    }
  };
  
  window.addEventListener('message', handleClientMessage);
  return () => window.removeEventListener('message', handleClientMessage);
}, []);
```

## Checklist

- [x] Analyze existing dashboard structure and client-related code
- [ ] Update Dashboard state management to track active clients
- [ ] Implement Add Client functionality with iframe integration
- [ ] Create Client display components with iframe wrapper (left-to-right row-major layout)
- [ ] Add Client management features (removal, iframe communication)
- [ ] Test client addition, removal, and iframe communication
- [ ] Smoke test complete functionality