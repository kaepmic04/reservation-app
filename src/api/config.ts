export const BLAND_AI_CONFIG = {
  apiKey: process.env.BLAND_AI_API_KEY || '',
  baseUrl: 'https://api.bland.ai/v1',
  endpoints: {
    calls: '/calls'
  }
};