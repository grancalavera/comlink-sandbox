import { useAtomValue, useSetAtom } from "jotai";
import { 
  clientId, 
  connectionTransitionAtom, 
  isConnectedAtom
} from "./connection-state.js";

// Hook to get connection status
export function useIsConnected(): boolean {
  return useAtomValue(isConnectedAtom);
}

// Hook to get connection actions
export function useConnection() {
  const setConnectionState = useSetAtom(connectionTransitionAtom);
  const isConnected = useAtomValue(isConnectedAtom);
  
  return {
    connect: () => setConnectionState("connected"),
    disconnect: () => setConnectionState("disconnected"),
    isConnected,
  };
}

// Export clientId for external use
export { clientId };
