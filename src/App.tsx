import React from 'react';
import { Header } from './components/Header';
import { ProductSection } from './components/ProductSection';
import { ResultSection } from './components/ResultSection';
import { ErrorMessage } from './components/ErrorMessage';
import { useStore } from './store/useStore';
import { useScraping } from './hooks/useScraping';

export function App() {
  const { products, results, error, addProduct, deleteProduct } = useStore();
  
  useScraping();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <ErrorMessage message={error} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ProductSection
            products={products}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
          />
          <ResultSection results={results} />
        </div>
      </main>
    </div>
  );
}