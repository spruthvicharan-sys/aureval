const { getClient } = require('../utils/anthropicClient');

const generate = async (req, res, next) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt?.trim()) return res.status(400).json({ error: 'prompt is required' });
    if (prompt.length > 2000) return res.status(400).json({ error: 'prompt too long (max 2000 chars)' });

    const client = getClient();

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      messages: [
        { role: 'system', content: 'You are a helpful, accurate AI assistant. Answer clearly and concisely.' },
        { role: 'user',   content: prompt.trim() }
      ]
    });

    const response = completion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      response,
      model: completion.model,
      inputTokens:  completion.usage?.prompt_tokens,
      outputTokens: completion.usage?.completion_tokens,
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { generate };
