interface Environment {
  websocketUrl: string;
  isDevelopment: boolean;
}

export const environment: Environment = {
  websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'ws://vinted-bot-server.onrender.com',
  isDevelopment: import.meta.env.DEV || false,
};