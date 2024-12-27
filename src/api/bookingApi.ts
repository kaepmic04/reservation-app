import type { Booking } from '../types/index.js';
import { findOptimalTable } from '../utils/bookingUtils.js';
import { loadTables, loadBookings, saveBookings } from '../utils/storage.js';

export async function handlePhoneBooking(data: {
  guests: number;
  date: string;
  time: string;
  customerName: string;
}): Promise<{
  success: boolean;
  message: string;
  bookingId?: string;
}> {
  try {
    const tables = loadTables();
    const bookings = loadBookings();

    const result = findOptimalTable(
      tables,
      data.guests,
      bookings,
      data.date,
      data.time
    );

    if (result.table) {
      const newBooking: Booking = {
        id: `${Date.now()}`,
        tableId: result.table.id,
        ...data
      };

      const updatedBookings = [...bookings, newBooking];
      saveBookings(updatedBookings);

      return {
        success: true,
        message: `Reservation confirmed for ${data.guests} people on ${data.date} at ${data.time}`,
        bookingId: newBooking.id
      };
    }

    return {
      success: false,
      message: `Sorry, no tables available for ${data.guests} people on ${data.date} at ${data.time}`
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while processing your reservation'
    };
  }
}