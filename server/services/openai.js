const axios = require('axios');
require('dotenv').config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function handleChat(messages) {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-70b-8192', //'mixtral-8x7b-32768',  // or 'llama3-70b-8192'
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error("💥 Groq error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { handleChat };
