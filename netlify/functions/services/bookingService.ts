import type { Booking } from '../types/booking';

export async function createBooking(booking: Booking) {
  try {
    // Here we would typically save to a database
    // For now, we'll just return a success response
    return {
      success: true,
      message: `Reservierung bestätigt für ${booking.guests} Personen am ${booking.date} um ${booking.time} Uhr`,
      bookingId: Date.now().toString()
    };
  } catch (error) {
    console.error('Booking error:', error);
    return {
      success: false,
      message: 'Die Reservierung konnte nicht durchgeführt werden.'
    };
  }
}