import { Handler } from '@netlify/functions';
import { createBooking } from './services/bookingService';
import type { Booking } from './types/booking';

// Validate webhook secret
const validateWebhook = (headers: { [key: string]: string }) => {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  return headers['x-webhook-secret'] === webhookSecret;
};

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Validate webhook secret
  if (!validateWebhook(event.headers)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const booking = JSON.parse(event.body || '{}') as Booking;
    
    // Validate required fields
    if (!booking.date || !booking.time || !booking.guests || !booking.customerName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['date', 'time', 'guests', 'customerName']
        })
      };
    }

    // Create booking
    const result = await createBooking(booking);

    return {
      statusCode: result.success ? 200 : 400,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};