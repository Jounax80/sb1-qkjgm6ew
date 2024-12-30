export const WEBSOCKET_CONFIG = {
  url: import.meta.env.VITE_WEBSOCKET_URL || 'https://vinted-bot-server.onrender.com',
  options: {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    forceNew: true,
    autoConnect: false,
  },
} as const;

export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  CONNECT_ERROR: 'connect_error',
  ERROR: 'error',
  MESSAGE: 'message',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
} as const;