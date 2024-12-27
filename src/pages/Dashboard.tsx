import React from 'react';
import { TableStats } from '../components/TableStats';
import { AvailabilityCalendar } from '../components/Calendar/AvailabilityCalendar';
import { RestaurantSettings } from '../components/RestaurantSettings';
import type { Table, Booking, RestaurantSettings as Settings } from '../types';

interface DashboardProps {
  tables: Table[];
  bookings: Booking[];
  onUpdateSettings: (settings: Settings) => void;
}

export function Dashboard({ tables, bookings, onUpdateSettings }: DashboardProps) {
  const activeBookings = bookings.filter(
    booking => new Date(`${booking.date} ${booking.time}`) >= new Date()
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Übersicht über Ihr Restaurant
        </p>
      </div>

      <RestaurantSettings onSave={onUpdateSettings} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Tische Gesamt</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{tables.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Plätze Gesamt</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {tables.reduce((sum, table) => sum + table.seats, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Aktive Buchungen</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{activeBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Belegte Plätze</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {bookings.reduce((sum, booking) => sum + booking.guests, 0)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Wochenbelegung</h2>
        <AvailabilityCalendar tables={tables} bookings={bookings} />
      </div>
    </div>
  );
}