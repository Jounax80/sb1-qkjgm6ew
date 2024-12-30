import React from 'react';
import type { VintedItem } from '../types';

interface ResultListProps {
  items: VintedItem[];
}

export function ResultList({ items }: ResultListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun résultat pour le moment
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
            <p className="text-lg font-bold text-indigo-600">{item.price}€</p>
            <p className="text-sm text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}