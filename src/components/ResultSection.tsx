import React from 'react';
import { ResultList } from './ResultList';
import type { VintedItem } from '../types';

interface ResultSectionProps {
  results: VintedItem[];
}

export function ResultSection({ results }: ResultSectionProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Résultats en temps réel
        </h2>
        <ResultList items={results} />
      </div>
    </div>
  );
}