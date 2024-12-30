import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
}

export function ProductList({ products, onDeleteProduct }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun produit suivi pour le moment
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">
              Prix: {product.minPrice}€ - {product.maxPrice}€
            </p>
          </div>
          <button
            onClick={() => onDeleteProduct(product.id)}
            className="text-red-600 hover:text-red-800 p-2"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}