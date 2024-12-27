import { handlePhoneBooking } from './bookingApi.js';

export const conversationFlow = {
  greeting: 'Welcome to our restaurant booking system. How many people would you like to make a reservation for?',

  async handleGuests(guests: number) {
    if (guests < 1 || guests > 20) {
      return {
        success: false,
        message: 'Please provide a valid number of guests between 1 and 20.',
        nextPrompt: 'How many people would you like to make a reservation for?'
      };
    }
    return {
      success: true,
      message: `Great, a table for ${guests} people. What date would you like to book for?`,
      nextPrompt: 'Please provide the date in DD-MM-YYYY format.'
    };
  },

  async confirmBooking(bookingData: {
    guests: number;
    date: string;
    time: string;
    customerName: string;
  }) {
    const result = await handlePhoneBooking(bookingData);
    
    if (result.success) {
      return {
        success: true,
        message: `${result.message}. Thank you for your reservation! Your booking reference is ${result.bookingId}.`,
        complete: true
      };
    }

    return {
      success: false,
      message: result.message,
      nextPrompt: 'Would you like to try a different date or time?'
    };
  }
};