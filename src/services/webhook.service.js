const { N8N_WEBHOOK_URL } = require('../config/env');

async function sendFeedbackToN8n(payload) {
  if (!N8N_WEBHOOK_URL) {
    return {
      sent: false,
      message: 'n8n webhook URL is not configured.',
    };
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook returned ${response.status}: ${errorText}`);
    }

    return {
      sent: true,
      message: 'n8n webhook sent successfully.',
      status: response.status,
    };
  } catch (error) {
    console.error('n8n webhook error:', error.message);
    return {
      sent: false,
      message: error.message,
    };
  }
}

module.exports = {
  sendFeedbackToN8n,
};
