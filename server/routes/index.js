import { Router } from 'express';
import { blandWebhookController } from '../controllers/blandWebhookController.js';

export const router = Router();

// Bland AI webhook endpoint
router.post('/webhook/bland', blandWebhookController);