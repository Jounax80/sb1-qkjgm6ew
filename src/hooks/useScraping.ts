import { useEffect, useCallback } from 'react';
import { VintedScraper } from '../services/scraping/vinted-scraper';
import { useStore } from '../store/useStore';
import type { ScrapingResult } from '../services/scraping/types';

export function useScraping() {
  const { products, updateResults, setError, clearError } = useStore();

  const handleNewItems = useCallback((items: ScrapingResult[]) => {
    clearError();
    updateResults(items);
  }, [updateResults, clearError]);

  useEffect(() => {
    const scraper = VintedScraper.getInstance();

    try {
      const searchParams = products.map(product => ({
        query: product.name,
        minPrice: product.minPrice,
        maxPrice: product.maxPrice,
      }));

      scraper.startScanning(searchParams, handleNewItems);
    } catch (error) {
      console.error('Failed to start scanning:', error);
      setError('Failed to start scanning. Please try again later.');
    }

    return () => {
      scraper.stopScanning();
    };
  }, [products, handleNewItems, setError]);
}