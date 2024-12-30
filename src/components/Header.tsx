import React from 'react';
import { Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Bell className="text-indigo-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">
            Bot Vinted - Alertes Prix
          </h1>
        </div>
      </div>
    </header>
  );
}