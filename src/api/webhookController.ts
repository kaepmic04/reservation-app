import { Request, Response } from 'express';
import { handlePhoneBooking } from './bookingApi.js';
import { conversationFlow } from './blandAiHandler.js';

export const handleBookingWebhook = async (req: Request, res: Response) => {
  try {
    const { guests, date, time, customerName } = req.body;
    const result = await handlePhoneBooking({ guests, date, time, customerName });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const handleBlandWebhook = async (req: Request, res: Response) => {
  const { transcript, call_id } = req.body;
  
  try {
    // Example response format for Bland AI
    const response = {
      messages: [{
        role: "assistant",
        content: "Thank you for your booking request. Let me help you with that."
      }]
    };

    res.json(response);
  } catch (error) {
    console.error('Bland AI webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};