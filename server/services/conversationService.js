import { parseNumber } from '../utils/numberParser.js';
import { parseDate } from '../utils/dateParser.js';
import { parseTime } from '../utils/timeParser.js';
import { createBooking } from './bookingService.js';

export class ConversationService {
  static handleConversation(transcript, state = { step: 'greeting' }) {
    switch (state.step) {
      case 'greeting':
        return this.createResponse(
          "Willkommen! Für wie viele Personen möchten Sie reservieren?",
          { step: 'guests' }
        );
      
      case 'guests':
        const guests = parseNumber(transcript);
        if (!guests || guests < 1 || guests > 20) {
          return this.createResponse(
            "Bitte geben Sie eine gültige Anzahl zwischen 1 und 20 Personen an.",
            state
          );
        }
        return this.createResponse(
          "Für welches Datum möchten Sie reservieren?",
          { ...state, step: 'date', guests }
        );
      
      case 'date':
        const date = parseDate(transcript);
        if (!date) {
          return this.createResponse(
            "Bitte geben Sie ein gültiges Datum an.",
            state
          );
        }
        return this.createResponse(
          "Um welche Uhrzeit möchten Sie reservieren?",
          { ...state, step: 'time', date }
        );
      
      case 'time':
        const time = parseTime(transcript);
        if (!time) {
          return this.createResponse(
            "Bitte geben Sie eine gültige Uhrzeit an.",
            state
          );
        }
        return this.createResponse(
          "Auf welchen Namen darf ich die Reservierung vornehmen?",
          { ...state, step: 'name', time }
        );
      
      case 'name':
        const customerName = transcript.trim();
        if (!customerName) {
          return this.createResponse(
            "Bitte geben Sie einen Namen an.",
            state
          );
        }
        return this.createResponse(
          `Perfekt! Ich fasse zusammen: Reservierung für ${state.guests} Personen am ${state.date} um ${state.time} Uhr auf den Namen ${customerName}. Ist das korrekt?`,
          { ...state, step: 'confirmation', customerName }
        );
      
      case 'confirmation':
        if (transcript.toLowerCase().includes('ja')) {
          // Create the booking
          const booking = {
            date: state.date,
            time: state.time,
            guests: state.guests,
            customerName: state.customerName
          };
          
          createBooking(booking);
          
          return this.createResponse(
            "Vielen Dank! Ihre Reservierung wurde bestätigt. Wir freuen uns auf Ihren Besuch!",
            { step: 'greeting' }
          );
        }
        return this.createResponse(
          "Okay, lassen Sie uns von vorne beginnen. Für wie viele Personen möchten Sie reservieren?",
          { step: 'guests' }
        );
      
      default:
        return this.createResponse(
          "Willkommen! Für wie viele Personen möchten Sie reservieren?",
          { step: 'guests' }
        );
    }
  }

  static createResponse(content, state) {
    return {
      messages: [{
        role: "assistant",
        content
      }],
      state
    };
  }
}