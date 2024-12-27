import { ConversationState, BlandAIResponse } from '../../src/types/conversation.js';

export class ConversationService {
  static handleConversation(transcript: string, state?: ConversationState): BlandAIResponse {
    return {
      messages: [{
        role: "assistant",
        content: "Thank you for your message. Our booking system is being updated."
      }],
      state: state || { step: 'greeting' }
    };
  }
}