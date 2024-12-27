import { createBooking } from '../services/bookingService.js';

export const bookingController = async (req, res) => {
  try {
    const { date, time, guests, customerName } = req.body;
    
    if (!date || !time || !guests || !customerName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const booking = await createBooking({ date, time, guests, customerName });
    res.json(booking);
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};