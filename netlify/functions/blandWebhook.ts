import { Handler } from '@netlify/functions';
import { ConversationService } from './services/conversationService';
import { createBooking } from './services/bookingService';
import type { BlandAIRequest } from './types/conversation';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const request = JSON.parse(event.body || '{}') as BlandAIRequest;
    const response = ConversationService.handleConversation(request.transcript, request.state);

    // If we have all booking information, create the booking
    if (request.state?.step === 'confirmation' && 
        request.transcript.toLowerCase().match(/ja|richtig|korrekt/)) {
      const booking = {
        date: request.state.date!,
        time: request.state.time!,
        guests: request.state.guests!,
        customerName: request.state.customerName!
      };
      
      const bookingResult = await createBooking(booking);
      if (!bookingResult.success) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            messages: [{
              role: "assistant",
              content: bookingResult.message
            }],
            state: { step: 'guests' }
          })
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};