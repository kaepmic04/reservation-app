import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversationService.js';
import type { BlandAIRequest } from '../../src/types/conversation.js';

export const webhookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req.body as BlandAIRequest;
    const response = ConversationService.handleConversation(request.transcript, request.state);
    res.json(response);
  } catch (error) {
    next(error);
  }
};