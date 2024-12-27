import { Router } from 'express';
import { bookingController } from '../controllers/bookingController.js';

const router = Router();

router.post('/', bookingController);

export default router;