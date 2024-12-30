import { useEffect, useCallback } from 'react';
import { ProductSubscriptionService } from '../services/websocket/product-subscription';
import { useStore } from '../store/useStore';
import type { WebSocketMessage } from '../types';

export function useWebSocket() {
  const { products, updateResults, setError, clearError } = useStore();
  
  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (message.type === 'NEW_ITEMS' && Array.isArray(message.payload)) {
      clearError();
      updateResults(message.payload);
    } else if (message.type === 'ERROR') {
      setError(typeof message.payload === 'string' ? message.payload : 'An error occurred');
    }
  }, [updateResults, setError, clearError]);

  useEffect(() => {
    const subscriptionService = ProductSubscriptionService.getInstance();

    try {
      subscriptionService.subscribe(products, handleMessage);
    } catch (error) {
      console.error('Failed to subscribe to products:', error);
      setError('Failed to connect to the server. Please try again later.');
    }

    return () => {
      subscriptionService.unsubscribe();
    };
  }, [products, handleMessage, setError]);
}