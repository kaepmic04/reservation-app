import React, { useState } from 'react';
import { BookingList } from '../components/BookingList';
import { BookingDialog } from '../components/BookingDialog';
import { findOptimalTable } from '../utils/bookingUtils';
import type { Table, Booking, TableCombination } from '../types';

interface BookingsProps {
  tables: Table[];
  bookings: Booking[];
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
  onDeleteBooking: (bookingId: string) => void;
}

export function Bookings({ tables, bookings, onAddBooking, onDeleteBooking }: BookingsProps) {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');
  const [currentBooking, setCurrentBooking] = useState<Omit<Booking, 'id' | 'tableId'> | null>(null);
  const [selectedCombination, setSelectedCombination] = useState<TableCombination | null>(null);

  const handleBooking = (bookingData: Omit<Booking, 'id' | 'tableId'>) => {
    const result = findOptimalTable(
      tables,
      bookingData.guests,
      bookings,
      bookingData.date,
      bookingData.time
    );

    if (result.table) {
      onAddBooking({
        ...bookingData,
        tableId: result.table.id
      });
      setIsBookingDialogOpen(false);
      setAvailabilityMessage('');
      setCurrentBooking(null);
      setSelectedCombination(null);
    } else if (result.combinations && result.combinations.length > 0) {
      setCurrentBooking(bookingData);
      setSelectedCombination(result.combinations[0]);
      setAvailabilityMessage(result.message);
    } else {
      setAvailabilityMessage(result.message);
      setCurrentBooking(null);
      setSelectedCombination(null);
    }
  };

  const handleConfirmCombination = () => {
    if (!currentBooking || !selectedCombination) return;

    selectedCombination.tableIds.forEach(tableId => {
      onAddBooking({
        ...currentBooking,
        tableId
      });
    });

    setIsBookingDialogOpen(false);
    setAvailabilityMessage('');
    setCurrentBooking(null);
    setSelectedCombination(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buchungen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verwalten Sie Ihre Reservierungen
          </p>
        </div>
        <button
          onClick={() => {
            setAvailabilityMessage('');
            setCurrentBooking(null);
            setSelectedCombination(null);
            setIsBookingDialogOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Neue Buchung
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <BookingList 
            bookings={bookings} 
            tables={tables} 
            onDeleteBooking={onDeleteBooking}
          />
        </div>
      </div>

      <BookingDialog
        isOpen={isBookingDialogOpen}
        onClose={() => {
          setIsBookingDialogOpen(false);
          setAvailabilityMessage('');
          setCurrentBooking(null);
          setSelectedCombination(null);
        }}
        onBook={handleBooking}
        availabilityMessage={availabilityMessage}
        showConfirmButton={!!selectedCombination}
        onConfirm={handleConfirmCombination}
      />
    </div>
  );
}