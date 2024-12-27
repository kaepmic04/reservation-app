export const createBooking = async ({ date, time, guests, customerName }) => {
  // Here you would typically interact with a database
  // For now, we'll return a mock response
  return {
    success: true,
    message: `Booking confirmed for ${guests} people on ${date} at ${time}`,
    bookingId: Date.now().toString()
  };
};