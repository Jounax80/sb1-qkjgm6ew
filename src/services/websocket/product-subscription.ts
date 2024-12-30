import type { Product, WebSocketMessage } from '../../types';
import { WebSocketConnection } from './connection';
import { WEBSOCKET_EVENTS } from '../../config/websocket.config';
import { useConnectionState } from './connection-state';

export class ProductSubscriptionService {
  private static instance: ProductSubscriptionService | null = null;
  private socket = WebSocketConnection.getInstance();
  private currentCallback: ((message: WebSocketMessage) => void) | null = null;
  private products: Product[] = [];

  private constructor() {
    this.setupConnectionStateListener();
  }

  public static getInstance(): ProductSubscriptionService {
    if (!ProductSubscriptionService.instance) {
      ProductSubscriptionService.instance = new ProductSubscriptionService();
    }
    return ProductSubscriptionService.instance;
  }

  private setupConnectionStateListener(): void {
    useConnectionState.subscribe((state) => {
      if (state.isConnected && this.products.length > 0 && this.currentCallback) {
        this.performSubscription(this.products, this.currentCallback);
      }
    });
  }

  private performSubscription(products: Product[], callback: (message: WebSocketMessage) => void): void {
    try {
      this.socket.emit(WEBSOCKET_EVENTS.SUBSCRIBE, { products });
      this.socket.on(WEBSOCKET_EVENTS.MESSAGE, callback);
    } catch (error) {
      console.error('Failed to subscribe to products:', error);
      if (callback) {
        callback({
          type: 'ERROR',
          payload: 'Failed to subscribe to products. Please try again.',
        });
      }
    }
  }

  public subscribe(products: Product[], callback: (message: WebSocketMessage) => void): void {
    this.products = products;
    this.currentCallback = callback;

    const { isConnected } = useConnectionState.getState();
    if (isConnected) {
      this.performSubscription(products, callback);
    }
  }

  public unsubscribe(): void {
    try {
      this.socket.emit(WEBSOCKET_EVENTS.UNSUBSCRIBE);
      if (this.currentCallback) {
        this.socket.off(WEBSOCKET_EVENTS.MESSAGE, this.currentCallback);
        this.currentCallback = null;
      }
      this.products = [];
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  }
}