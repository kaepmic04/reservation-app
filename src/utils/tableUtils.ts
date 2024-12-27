import type { Table, TableGroup, TableCombination } from '../types/index.js';

export function generateTablesFromGroup(group: TableGroup): Table[] {
  const timestamp = Date.now();
  return Array.from({ length: group.count }, (_, index) => ({
    id: `${timestamp}-${index}`,
    groupId: `${timestamp}`,
    name: `${group.name} ${index + 1}`,
    seats: group.seats,
    combinableWith: [],
  }));
}

export function getPossibleCombinations(tables: Table[], requiredSeats: number): TableCombination[] {
  const combinations: TableCombination[] = [];

  const canCombineTables = (table1: Table, table2: Table): boolean => {
    const table1CanCombine = table1.combinableWith?.includes(table2.id) ?? false;
    const table2CanCombine = table2.combinableWith?.includes(table1.id) ?? false;
    const sameBaseGroup = table1.name.replace(/\s+\d+$/, '') === table2.name.replace(/\s+\d+$/, '');
    
    return (table1CanCombine || table2CanCombine) && sameBaseGroup;
  };

  for (let i = 0; i < tables.length; i++) {
    for (let j = i + 1; j < tables.length; j++) {
      if (canCombineTables(tables[i], tables[j])) {
        const totalSeats = tables[i].seats + tables[j].seats;
        if (totalSeats >= requiredSeats) {
          combinations.push({
            tableIds: [tables[i].id, tables[j].id],
            totalSeats
          });
        }
      }
    }
  }

  return combinations.sort((a, b) => 
    Math.abs(a.totalSeats - requiredSeats) - Math.abs(b.totalSeats - requiredSeats)
  );
}