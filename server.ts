import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ConversationService } from './src/services/conversationService.js';
import type { BlandAIRequest } from './src/types/conversation.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Error handler middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Bland AI webhook endpoint
app.post('/webhook/bland', async (req, res, next) => {
  try {
    const request = req.body as BlandAIRequest;
    const response = ConversationService.handleConversation(request.transcript, request.state);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});