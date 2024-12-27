import React, { useState, useEffect } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import type { Table } from '../types';

interface TableGridProps {
  tables: Table[];
  onUpdateCombinableWith: (tableId: string, combinableWith: string[]) => void;
  onDeleteTable: (tableId: string) => void;
}

export function TableGrid({ tables, onUpdateCombinableWith, onDeleteTable }: TableGridProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.settings-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleCombinableChange = (tableId: string, targetId: string, isChecked: boolean) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const newCombinableWith = isChecked
      ? [...(table.combinableWith || []), targetId]
      : (table.combinableWith || []).filter(id => id !== targetId);

    onUpdateCombinableWith(tableId, newCombinableWith);
  };

  const getTablesByGroup = (table: Table) => {
    const baseName = table.name.replace(/\s+\d+$/, '');
    return tables.filter(t => 
      t.id !== table.id && // Exclude current table
      t.name.replace(/\s+\d+$/, '') === baseName && // Same base name
      t.seats === table.seats // Same number of seats
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tables.map((table) => (
        <div
          key={table.id}
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 relative"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{table.name}</h3>
            <div className="relative settings-dropdown flex items-center space-x-2">
              <button
                onClick={() => onDeleteTable(table.id)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                title="Tisch löschen"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveDropdown(activeDropdown === table.id ? null : table.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Tischeinstellungen"
              >
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
              
              {activeDropdown === table.id && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 top-full">
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Kombinierbar mit:
                    </h4>
                    <div className="space-y-2">
                      {getTablesByGroup(table).map(otherTable => (
                        <label
                          key={otherTable.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={table.combinableWith?.includes(otherTable.id) || false}
                            onChange={(e) => handleCombinableChange(table.id, otherTable.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-sm text-gray-600 select-none">
                            {otherTable.name} ({otherTable.seats} Plätze)
                          </span>
                        </label>
                      ))}
                      {getTablesByGroup(table).length === 0 && (
                        <p className="text-sm text-gray-500 italic">
                          Keine kombinierbaren Tische verfügbar
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="mt-1 text-sm text-gray-500">
            {table.seats} {table.seats === 1 ? 'Platz' : 'Plätze'}
          </p>
          
          {(table.combinableWith || []).length > 0 && (
            <p className="mt-2 text-sm text-blue-600">
              Kombinierbar mit: {tables
                .filter(t => table.combinableWith?.includes(t.id))
                .map(t => t.name)
                .join(', ')}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}