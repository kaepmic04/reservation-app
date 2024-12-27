import { ConversationService } from '../services/conversationService.js';

export const blandWebhookController = async (req, res) => {
  try {
    const { transcript, state } = req.body;
    
    // Handle the conversation
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
};