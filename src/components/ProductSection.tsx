import React from 'react';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import type { Product } from '../types';

interface ProductSectionProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onDeleteProduct: (id: string) => void;
}

export function ProductSection({ products, onAddProduct, onDeleteProduct }: ProductSectionProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <ProductForm onAddProduct={onAddProduct} />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Produits suivis
        </h2>
        <ProductList
          products={products}
          onDeleteProduct={onDeleteProduct}
        />
      </div>
    </div>
  );
}