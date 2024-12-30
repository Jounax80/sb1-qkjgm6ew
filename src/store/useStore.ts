import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, VintedItem } from '../types';

interface Store {
  products: Product[];
  results: VintedItem[];
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  deleteProduct: (id: string) => void;
  updateResults: (items: VintedItem[]) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      products: [],
      results: [],
      error: null,
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
          error: null,
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          error: null,
        })),
      updateResults: (items) =>
        set((state) => ({
          results: [...items, ...state.results].slice(0, 50), // Keep last 50 items
          error: null,
        })),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'vinted-bot-storage',
    }
  )
);