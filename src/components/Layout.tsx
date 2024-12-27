import React from 'react';
import { LayoutGrid, Calendar, Settings, Users, BarChart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: 'dashboard' | 'tables' | 'bookings' | 'statistics') => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">RestaurantOS</h1>
        </div>
        <nav className="mt-6">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center px-6 py-3 text-gray-600 w-full text-left ${
              currentPage === 'dashboard' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('bookings')}
            className={`flex items-center px-6 py-3 text-gray-600 w-full text-left ${
              currentPage === 'bookings' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Buchungen
          </button>
          <button 
            onClick={() => onNavigate('tables')}
            className={`flex items-center px-6 py-3 text-gray-600 w-full text-left ${
              currentPage === 'tables' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Tische
          </button>
          <button 
            onClick={() => onNavigate('statistics')}
            className={`flex items-center px-6 py-3 text-gray-600 w-full text-left ${
              currentPage === 'statistics' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <BarChart className="w-5 h-5 mr-3" />
            Statistiken
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}