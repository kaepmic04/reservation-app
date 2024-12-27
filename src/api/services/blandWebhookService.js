export const handleBlandWebhook = async (transcript, callId) => {
  console.log('Processing Bland AI webhook:', { transcript, callId });
  
  return {
    messages: [{
      role: "assistant",
      content: "Thank you for your booking request. Let me help you with that."
    }]
  };
};