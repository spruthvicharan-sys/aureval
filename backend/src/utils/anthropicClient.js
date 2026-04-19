const Groq = require('groq-sdk');

let _client = null;

function getClient() {
  if (!_client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }
    _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _client;
}

module.exports = { getClient };
