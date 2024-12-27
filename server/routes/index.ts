import { Router } from 'express';
import { webhookController } from '../controllers/webhookController.js';

export const router = Router();

router.post('/webhook/bland', webhookController);