const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Anthropic API errors
  if (err.status && err.error) {
    return res.status(err.status).json({
      error: 'Anthropic API error',
      message: err.error?.error?.message || err.message
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // API key missing
  if (err.message?.includes('GROQ_API_KEY')) {
    return res.status(500).json({
      error: 'API key not configured',
      message: 'Set GROQ_API_KEY in your .env file'
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = { errorHandler };
