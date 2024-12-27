import { Handler } from '@netlify/functions';
import express, { Router } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';

const api = express();
const router = Router();

// Middleware
api.use(cors());
api.use(express.json());

// Routes
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Booking routes
router.post('/bookings', async (req, res) => {
  try {
    const { date, time, guests, customerName } = req.body;
    
    if (!date || !time || !guests || !customerName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // For now, just return success
    res.json({
      success: true,
      message: `Booking confirmed for ${guests} people on ${date} at ${time}`,
      bookingId: Date.now().toString()
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

api.use('/api', router);

export const handler: Handler = serverless(api);