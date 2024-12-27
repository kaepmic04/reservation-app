import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generic webhook endpoint
app.post('/api/webhook', async (req, res) => {
  try {
    const { date, time, guests, customerName } = req.body;
    
    // Validate webhook secret
    const webhookSecret = req.headers['x-webhook-secret'];
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate required fields
    if (!date || !time || !guests || !customerName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['date', 'time', 'guests', 'customerName']
      });
    }

    // Create booking
    const result = {
      success: true,
      message: `Reservierung bestätigt für ${guests} Personen am ${date} um ${time} Uhr`,
      bookingId: Date.now().toString()
    };

    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});