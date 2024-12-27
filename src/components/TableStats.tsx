import React from 'react';
import type { Table } from '../types';

interface TableStatsProps {
  tables: Table[];
}

export function TableStats({ tables }: TableStatsProps) {
  const totalTables = tables.length;
  const totalSeats = tables.reduce((sum, table) => sum + table.seats, 0);
  const uniqueGroups = new Set(tables.map(table => table.groupId)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Gesamtzahl Tische</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{totalTables}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Gesamtzahl Plätze</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{totalSeats}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Tischgruppen</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{uniqueGroups}</p>
      </div>
    </div>
  );
}