import { Router } from 'express';
import { blandWebhookController } from '../controllers/blandWebhookController.js';

const router = Router();

router.post('/bland', blandWebhookController);

export default router;