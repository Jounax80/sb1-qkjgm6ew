import { create } from 'zustand';

interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  lastError: string | null;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
}

export const useConnectionState = create<ConnectionState>((set) => ({
  isConnected: false,
  isConnecting: false,
  lastError: null,
  setConnected: (connected) => set({ isConnected: connected, isConnecting: false, lastError: null }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  setError: (error) => set({ lastError: error, isConnecting: false }),
}));