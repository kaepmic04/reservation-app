import type { Table, Booking, TableCombination } from '../types/index.js';
import { getPossibleCombinations } from './tableUtils.js';

export function isTableBookedInTimeRange(
  table: Table,
  bookings: Booking[],
  date: string,
  startTime: string,
  endTime: string
): boolean {
  return bookings.some(booking => 
    booking.tableId === table.id && 
    booking.date === date && 
    booking.time >= startTime && 
    booking.time <= endTime
  );
}

export function getAvailableSeats(tables: Table[], bookings: Booking[], date: string, time: string): number {
  const startDate = new Date(`${date}T${time}`);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  const endTime = endDate.toTimeString().slice(0, 5);

  const availableTables = tables.filter(
    table => !isTableBookedInTimeRange(table, bookings, date, time, endTime)
  );

  return availableTables.reduce((sum, table) => sum + table.seats, 0);
}

export function findOptimalTable(
  tables: Table[],
  guests: number,
  bookings: Booking[],
  date: string,
  time: string
): { table: Table | null; message: string; combinations?: TableCombination[] } {
  const startDate = new Date(`${date}T${time}`);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
  const endTime = endDate.toTimeString().slice(0, 5);

  const availableTables = tables.filter(
    table => !isTableBookedInTimeRange(table, bookings, date, time, endTime)
  );

  if (availableTables.length === 0) {
    return {
      table: null,
      message: 'Leider sind alle Tische zu diesem Zeitpunkt ausgebucht.'
    };
  }

  const suitableTable = availableTables
    .filter(table => table.seats >= guests)
    .sort((a, b) => (a.seats - guests) - (b.seats - guests))[0];

  if (suitableTable) {
    return {
      table: suitableTable,
      message: `Tisch ${suitableTable.name} wurde für Sie reserviert.`
    };
  }

  const combinations = getPossibleCombinations(availableTables, guests);
  
  if (combinations.length > 0) {
    const bestCombination = combinations[0];
    const combinedTables = bestCombination.tableIds.map(id => 
      tables.find(t => t.id === id)!
    );
    
    return {
      table: null,
      message: `Für ${guests} Personen werden folgende Tische kombiniert: ${
        combinedTables.map(t => t.name).join(' + ')
      }`,
      combinations: [bestCombination]
    };
  }

  return {
    table: null,
    message: `Leider haben wir keine passende Tischkombination für ${guests} Personen.`
  };
}