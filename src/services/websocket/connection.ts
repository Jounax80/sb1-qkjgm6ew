import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_CONFIG, WEBSOCKET_EVENTS } from '../../config/websocket.config';
import { useConnectionState } from './connection-state';

export class WebSocketConnection {
  private static instance: Socket | null = null;
  private static reconnectTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): Socket {
    if (!WebSocketConnection.instance) {
      WebSocketConnection.instance = io(WEBSOCKET_CONFIG.url, WEBSOCKET_CONFIG.options);
      WebSocketConnection.setupBaseListeners();
      WebSocketConnection.connect();
    }
    return WebSocketConnection.instance;
  }

  private static connect(): void {
    if (!WebSocketConnection.instance) return;
    
    const { setConnecting } = useConnectionState.getState();
    setConnecting(true);
    WebSocketConnection.instance.connect();
  }

  private static setupBaseListeners(): void {
    if (!WebSocketConnection.instance) return;

    const { setConnected, setError } = useConnectionState.getState();

    WebSocketConnection.instance.on(WEBSOCKET_EVENTS.CONNECT, () => {
      console.log('Connected to Vinted server');
      setConnected(true);
      if (WebSocketConnection.reconnectTimer) {
        clearTimeout(WebSocketConnection.reconnectTimer);
        WebSocketConnection.reconnectTimer = null;
      }
    });

    WebSocketConnection.instance.on(WEBSOCKET_EVENTS.CONNECT_ERROR, (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to server. Retrying...');
      WebSocketConnection.handleReconnect();
    });

    WebSocketConnection.instance.on(WEBSOCKET_EVENTS.ERROR, (error) => {
      console.error('Socket error:', error);
      setError('An error occurred with the connection');
    });
  }

  private static handleReconnect(): void {
    if (WebSocketConnection.reconnectTimer) return;

    const { setConnecting } = useConnectionState.getState();
    
    WebSocketConnection.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect...');
      setConnecting(true);
      WebSocketConnection.instance?.connect();
      WebSocketConnection.reconnectTimer = null;
    }, WEBSOCKET_CONFIG.options.reconnectionDelay);
  }

  public static disconnect(): void {
    if (WebSocketConnection.instance) {
      const { setConnected } = useConnectionState.getState();
      setConnected(false);
      WebSocketConnection.instance.disconnect();
      WebSocketConnection.instance = null;
    }

    if (WebSocketConnection.reconnectTimer) {
      clearTimeout(WebSocketConnection.reconnectTimer);
      WebSocketConnection.reconnectTimer = null;
    }
  }
}