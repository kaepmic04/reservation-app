import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tables } from './pages/Tables';
import { Bookings } from './pages/Bookings';
import { Statistics } from './pages/Statistics';
import { generateTablesFromGroup } from './utils/tableUtils';
import { loadTables, saveTables, loadBookings, saveBookings, loadSettings, saveSettings } from './utils/storage';
import type { Table, TableGroup, Booking, RestaurantSettings } from './types';

export default function App() {
  const [tables, setTables] = useState<Table[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(loadSettings());
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'tables' | 'bookings' | 'statistics'>('dashboard');

  useEffect(() => {
    setTables(loadTables());
    setBookings(loadBookings());
  }, []);

  const handleAddTables = (tableGroup: TableGroup) => {
    const newTables = generateTablesFromGroup(tableGroup);
    const updatedTables = [...tables, ...newTables];
    setTables(updatedTables);
    saveTables(updatedTables);
  };

  const handleBooking = (bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      id: `${Date.now()}`,
      ...bookingData,
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const handleDeleteBooking = (bookingId: string) => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const handleUpdateSettings = (newSettings: RestaurantSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard tables={tables} bookings={bookings} onUpdateSettings={handleUpdateSettings} />;
      case 'tables':
        return <Tables tables={tables} onAddTables={handleAddTables} />;
      case 'bookings':
        return <Bookings tables={tables} bookings={bookings} onAddBooking={handleBooking} onDeleteBooking={handleDeleteBooking} />;
      case 'statistics':
        return <Statistics bookings={bookings} />;
    }
  };

  return (
    <Layout onNavigate={setCurrentPage} currentPage={currentPage}>
      {renderPage()}
    </Layout>
  );
}