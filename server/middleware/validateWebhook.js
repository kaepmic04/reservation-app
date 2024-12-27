export const validateWebhook = (req) => {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  return req.headers['x-webhook-secret'] === webhookSecret;
};