import { ConversationState, BlandAIResponse } from '../types/conversation';
import { parseNumber } from '../utils/numberParser';
import { parseDate } from '../utils/dateParser';
import { parseTime } from '../utils/timeParser';

export class ConversationService {
  private static readonly responses = {
    greeting: "Willkommen bei unserem Restaurant-Reservierungsservice. Für wie viele Personen möchten Sie reservieren?",
    invalidGuests: "Bitte geben Sie eine gültige Personenanzahl zwischen 1 und 20 an.",
    askDate: "Für welches Datum möchten Sie reservieren?",
    invalidDate: "Entschuldigung, ich konnte das Datum nicht verstehen. Bitte nennen Sie ein gültiges Datum.",
    askTime: "Um welche Uhrzeit möchten Sie reservieren?",
    invalidTime: "Entschuldigung, ich konnte die Uhrzeit nicht verstehen. Bitte nennen Sie eine gültige Uhrzeit.",
    askName: "Auf welchen Namen soll ich die Reservierung vornehmen?",
    confirmation: (state: Required<Pick<ConversationState, 'guests' | 'date' | 'time' | 'customerName'>>) => 
      `Perfekt! Ich fasse zusammen: Reservierung für ${state.guests} Personen am ${state.date} um ${state.time} Uhr auf den Namen ${state.customerName}. Ist das korrekt?`
  };

  static handleConversation(transcript: string, state?: ConversationState): BlandAIResponse {
    const currentState = state || { step: 'greeting' };
    
    switch (currentState.step) {
      case 'guests':
        return this.handleGuestsStep(transcript, currentState);
      case 'date':
        return this.handleDateStep(transcript, currentState);
      case 'time':
        return this.handleTimeStep(transcript, currentState);
      case 'name':
        return this.handleNameStep(transcript, currentState);
      case 'confirmation':
        return this.handleConfirmationStep(transcript, currentState);
      default:
        return this.createResponse(this.responses.greeting, { step: 'guests' });
    }
  }

  private static handleGuestsStep(transcript: string, state: ConversationState): BlandAIResponse {
    const guests = parseNumber(transcript);
    
    if (!guests || guests < 1 || guests > 20) {
      return this.createResponse(this.responses.invalidGuests, state);
    }

    return this.createResponse(
      this.responses.askDate,
      { ...state, step: 'date' as const, guests }
    );
  }

  private static handleDateStep(transcript: string, state: ConversationState): BlandAIResponse {
    const date = parseDate(transcript);
    
    if (!date) {
      return this.createResponse(this.responses.invalidDate, state);
    }

    return this.createResponse(
      this.responses.askTime,
      { ...state, step: 'time' as const, date }
    );
  }

  private static handleTimeStep(transcript: string, state: ConversationState): BlandAIResponse {
    const time = parseTime(transcript);
    
    if (!time) {
      return this.createResponse(this.responses.invalidTime, state);
    }

    return this.createResponse(
      this.responses.askName,
      { ...state, step: 'name' as const, time }
    );
  }

  private static handleNameStep(transcript: string, state: ConversationState): BlandAIResponse {
    const customerName = transcript.trim();
    
    if (!customerName) {
      return this.createResponse(this.responses.askName, state);
    }

    const updatedState = { 
      ...state, 
      step: 'confirmation' as const, 
      customerName 
    };

    if (!updatedState.guests || !updatedState.date || !updatedState.time) {
      return this.createResponse(
        "Entschuldigung, es fehlen einige Informationen. Lassen Sie uns von vorne beginnen.",
        { step: 'guests' }
      );
    }

    return this.createResponse(
      this.responses.confirmation(updatedState as Required<typeof updatedState>),
      updatedState
    );
  }

  private static handleConfirmationStep(transcript: string, state: ConversationState): BlandAIResponse {
    const confirmation = transcript.toLowerCase();
    
    if (confirmation.match(/ja|richtig|korrekt/)) {
      return this.createResponse(
        "Vielen Dank! Ihre Reservierung wurde bestätigt. Wir freuen uns auf Ihren Besuch!",
        { ...state, step: 'greeting' as const }
      );
    }
    
    return this.createResponse(
      "Entschuldigung, lassen Sie uns die Reservierung neu starten. Für wie viele Personen möchten Sie reservieren?",
      { step: 'guests' }
    );
  }

  private static createResponse(content: string, state: ConversationState): BlandAIResponse {
    return {
      messages: [{
        role: "assistant",
        content
      }],
      state
    };
  }
}