import { Router } from 'express';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { handleBookingWebhook, handleBlandWebhook } from '../webhookController.js';

const router = Router();

// Public endpoints
router.post('/bland/webhook', handleBlandWebhook);

// Protected endpoints
router.post('/bookings', apiKeyAuth, handleBookingWebhook);
router.get('/availability', apiKeyAuth, (req, res) => {
  // Implementation für Verfügbarkeitsprüfung
});

export default router;