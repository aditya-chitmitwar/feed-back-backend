require('dotenv').config();

module.exports = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'development-secret-change-me',
  API_KEY: process.env.API_KEY || 'development-api-key',
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY || '',
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || '',
  AIRTABLE_TABLE_NAME: process.env.AIRTABLE_TABLE_NAME || 'Feedback',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || '',
};
