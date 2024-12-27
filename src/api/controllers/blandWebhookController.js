import { handleBlandWebhook } from '../services/blandWebhookService.js';

export const blandWebhookController = async (req, res) => {
  try {
    const { transcript, call_id } = req.body;
    const response = await handleBlandWebhook(transcript, call_id);
    res.json(response);
  } catch (error) {
    console.error('Error processing Bland AI webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};