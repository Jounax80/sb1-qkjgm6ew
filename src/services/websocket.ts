import { io, Socket } from 'socket.io-client';
import type { WebSocketMessage, Product } from '../types';
import { environment } from '../config/environment';

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 2000;
  private isConnecting = false;
  private messageQueue: { products: Product[] }[] = [];
  private currentCallback: ((message: WebSocketMessage) => void) | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeSocket();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private async initializeSocket() {
    if (this.isConnecting || this.socket?.connected) return;
    this.isConnecting = true;

    try {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }

      this.socket = io(environment.websocketUrl, {
        reconnection: false, // We'll handle reconnection manually
        timeout: 5000,
        transports: ['websocket'],
        forceNew: true,
        path: '/socket.io',
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.handleConnectionError();
    } finally {
      this.isConnecting = false;
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
      this.processMessageQueue();
      
      if (this.currentCallback) {
        this.currentCallback({
          type: 'NEW_ITEMS',
          payload: [],
        });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.attemptReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleConnectionError();
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      if (this.currentCallback) {
        this.currentCallback({
          type: 'ERROR',
          payload: 'Connection error. Attempting to reconnect...',
        });
      }
    });
  }

  private handleConnectionError() {
    this.attemptReconnect();
  }

  private attemptReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      if (this.currentCallback) {
        this.currentCallback({
          type: 'ERROR',
          payload: 'Unable to connect to server. Please refresh the page to try again.',
        });
      }
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    this.reconnectTimeout = setTimeout(() => {
      this.initializeSocket();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  private async processMessageQueue() {
    if (!this.socket?.connected || this.messageQueue.length === 0) return;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        await this.socket.emitWithAck('subscribe', message);
      }
    }
  }

  public async subscribeToProducts(products: Product[], callback: (message: WebSocketMessage) => void) {
    this.currentCallback = callback;

    if (!this.socket?.connected) {
      this.messageQueue.push({ products });
      await this.initializeSocket();
      return;
    }

    try {
      await this.socket.emitWithAck('subscribe', { products });
      this.socket.on('message', callback);
    } catch (error) {
      console.error('Failed to subscribe to products:', error);
      callback({
        type: 'ERROR',
        payload: 'Failed to subscribe to products. Retrying...',
      });
      this.attemptReconnect();
    }
  }

  public unsubscribe() {
    if (!this.socket?.connected) return;

    try {
      this.socket.emit('unsubscribe');
      this.socket.off('message');
      this.currentCallback = null;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (!this.socket) return;

    try {
      this.unsubscribe();
      this.socket.disconnect();
      this.socket = null;
      this.messageQueue = [];
      this.currentCallback = null;
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }
}