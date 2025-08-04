# Implement subscription system in SharedWorker RPC

## Description

Add a subscription system to the SharedWorker RPC that allows clients to subscribe to a counter that increments every second. The subscription system should:

- Maintain an underlying numeric state (default value: 0)
- When a new subscriber connects, start incrementing the value 1 time per second
- Notify all subscribers on each increment
- Allow new subscribers to read the current value immediately
- New subscribers join the current increment cycle (don't start from 0)

## Checklist

- [ ] Add subscription state management to ComlinkWorker class
- [ ] Implement subscribe method that returns current value and sets up notifications  
- [ ] Implement unsubscribe method for cleanup
- [ ] Add interval timer that increments counter and notifies subscribers
- [ ] Update RPC types to include subscription methods
- [ ] Test subscription system with multiple clients
- [ ] Update client code to demonstrate subscription usage

## Technical Requirements

### Worker State
- Counter starts at 0
- Increment rate: 1 per second
- Track active subscribers

### Subscription API
- `subscribe()`: Returns current value, adds client to notification list
- `unsubscribe()`: Removes client from notification list  
- Automatic cleanup on client disconnect

### Notification System
- All active subscribers receive updates simultaneously
- New subscribers get current value immediately
- Next update includes new subscribers in the same cycle