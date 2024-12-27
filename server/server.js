import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ConversationService } from './services/conversationService.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Bland AI webhook endpoint
app.post('/api/webhook/bland', async (req, res) => {
  try {
    const { transcript, state } = req.body;
    const response = ConversationService.handleConversation(transcript, state);
    res.json(response);
  } catch (error) {
    console.error('Bland AI webhook error:', error);
    res.status(500).json({ 
      messages: [{
        role: "assistant",
        content: "Entschuldigung, es ist ein Fehler aufgetreten."
      }],
      state: { step: 'greeting' }
    });
  }
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

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});