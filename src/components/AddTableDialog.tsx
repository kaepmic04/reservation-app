import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { TableGroup, Table } from '../types';

interface AddTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tableGroup: TableGroup) => void;
  existingTables: Table[];
}

export function AddTableDialog({ isOpen, onClose, onAdd, existingTables }: AddTableDialogProps) {
  const [formData, setFormData] = useState<TableGroup & { combinableWith: string[] }>({
    name: '',
    seats: 2,
    count: 1,
    combinableWith: [],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { combinableWith, ...tableGroup } = formData;
    onAdd(tableGroup);
    onClose();
    setFormData({ name: '', seats: 2, count: 1, combinableWith: [] });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'seats' | 'count') => {
    const value = parseInt(e.target.value) || 1;
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(1, value)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tische hinzufügen</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tischname
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="z.B. Großer Tisch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plätze pro Tisch
            </label>
            <input
              type="number"
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.seats}
              onChange={(e) => handleNumberChange(e, 'seats')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Anzahl der Tische
            </label>
            <input
              type="number"
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.count}
              onChange={(e) => handleNumberChange(e, 'count')}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}