import { validateWebhook } from '../middleware/validateWebhook.js';
import { createBooking } from '../services/bookingService.js';

export const webhookController = async (req, res) => {
  try {
    // Validate webhook secret
    if (!validateWebhook(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const booking = req.body;
    
    // Validate required fields
    if (!booking.date || !booking.time || !booking.guests || !booking.customerName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['date', 'time', 'guests', 'customerName']
      });
    }

    // Create booking
    const result = await createBooking(booking);
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};