export interface ScrapingConfig {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  interval?: number;
}

export interface ScrapingResult {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  url: string;
  timestamp: Date;
}