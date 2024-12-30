import React from 'react';
import { useConnectionState } from '../services/websocket/connection-state';
import { Wifi, WifiOff } from 'lucide-react';

export function ConnectionStatus() {
  const { isConnected, isConnecting, lastError } = useConnectionState();

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 p-2 rounded-lg bg-white shadow-md">
      {isConnected ? (
        <Wifi className="text-green-500" size={20} />
      ) : (
        <WifiOff className="text-red-500" size={20} />
      )}
      <span className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
        {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
      </span>
      {lastError && (
        <span className="text-xs text-red-500 ml-2">{lastError}</span>
      )}
    </div>
  );
}