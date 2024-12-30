export interface Product {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  createdAt: Date;
}

export interface VintedItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  url: string;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: 'NEW_ITEMS' | 'ERROR';
  payload: VintedItem[] | string;
}