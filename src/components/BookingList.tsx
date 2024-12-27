import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import type { Booking, Table } from '../types';

interface BookingListProps {
  bookings: Booking[];
  tables: Table[];
  onDeleteBooking: (bookingId: string) => void;
}

export function BookingList({ bookings, tables, onDeleteBooking }: BookingListProps) {
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

  const getTableName = (tableId: string): string => {
    const table = tables.find(t => t.id === tableId);
    return table ? table.name : 'Unbekannter Tisch';
  };

  const handleDelete = (bookingId: string) => {
    if (confirm('Möchten Sie diese Buchung wirklich löschen?')) {
      onDeleteBooking(bookingId);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Keine Buchungen</h3>
        <p className="mt-1 text-sm text-gray-500">
          Es wurden noch keine Reservierungen vorgenommen.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Datum & Zeit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tisch
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Personen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedBookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(booking.date).toLocaleDateString('de-DE')} um {booking.time} Uhr
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {booking.customerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTableName(booking.tableId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {booking.guests} {booking.guests === 1 ? 'Person' : 'Personen'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Buchung löschen"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}