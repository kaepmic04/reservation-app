export type ConversationStep = 'greeting' | 'guests' | 'date' | 'time' | 'name' | 'confirmation';

export interface ConversationState {
  step: ConversationStep;
  guests?: number;
  date?: string;
  time?: string;
  customerName?: string;
}

export interface BlandAIRequest {
  transcript: string;
  call_id: string;
  state?: ConversationState;
}

export interface BlandAIResponse {
  messages: Array<{
    role: "assistant";
    content: string;
  }>;
  state?: ConversationState;
}