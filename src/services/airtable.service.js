const Airtable = require('airtable');
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = require('../config/env');

let base = null;

if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
  Airtable.configure({ apiKey: AIRTABLE_API_KEY });
  base = Airtable.base(AIRTABLE_BASE_ID);
}

const createFeedbackRecord = async ({ name, email, feedback }) => {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable is not configured. Please add AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your environment variables.');
  }

  if (!base) {
    throw new Error('Airtable base could not be initialized. Please verify your Airtable credentials and base ID.');
  }

  const table = base(AIRTABLE_TABLE_NAME);

  const record = await table.create({
    Name: name,
    Email: email,
    Feedback: feedback,
  });

  return record;
};

module.exports = {
  createFeedbackRecord,
};
