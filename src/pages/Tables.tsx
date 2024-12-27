import React, { useState } from 'react';
import { TableGrid } from '../components/TableGrid';
import { AddTableDialog } from '../components/AddTableDialog';
import { saveTables } from '../utils/storage';
import type { Table, TableGroup } from '../types';

interface TablesProps {
  tables: Table[];
  onAddTables: (tableGroup: TableGroup) => void;
}

export function Tables({ tables, onAddTables }: TablesProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleUpdateCombinableWith = (tableId: string, combinableWith: string[]) => {
    const updatedTables = tables.map(table => {
      if (table.id === tableId) {
        // Update the current table
        return { ...table, combinableWith };
      }
      // Update the other table in the combination to maintain bidirectional relationship
      if (combinableWith.includes(table.id)) {
        return {
          ...table,
          combinableWith: Array.from(new Set([...(table.combinableWith || []), tableId]))
        };
      }
      // Remove the current table from other table's combinations if it's no longer combined
      if (table.combinableWith?.includes(tableId) && !combinableWith.includes(table.id)) {
        return {
          ...table,
          combinableWith: table.combinableWith.filter(id => id !== tableId)
        };
      }
      return table;
    });

    saveTables(updatedTables);
    // Trigger a re-render with the new tables
    onAddTables({ name: '', seats: 0, count: 0 });
  };

  const handleDeleteTable = (tableId: string) => {
    if (!confirm('Möchten Sie diesen Tisch wirklich löschen?')) return;

    const updatedTables = tables
      .filter(table => table.id !== tableId)
      .map(table => ({
        ...table,
        combinableWith: table.combinableWith?.filter(id => id !== tableId) || []
      }));
    
    saveTables(updatedTables);
    onAddTables({ name: '', seats: 0, count: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tische</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verwalten Sie Ihre Tische und deren Kapazitäten
          </p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Tisch hinzufügen
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <TableGrid 
            tables={tables} 
            onUpdateCombinableWith={handleUpdateCombinableWith}
            onDeleteTable={handleDeleteTable}
          />
        </div>
      </div>

      <AddTableDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={onAddTables}
        existingTables={tables}
      />
    </div>
  );
}