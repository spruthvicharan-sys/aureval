require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const evaluateRouter = require('./routes/evaluate');
const generateRouter = require('./routes/generate');
const historyRouter = require('./routes/history');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security & Middleware ──
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ──
app.use('/api/', rateLimiter);

// ── Routes ──
app.use('/api/evaluate', evaluateRouter);
app.use('/api/generate', generateRouter);
app.use('/api/history', historyRouter);

// ── Health Check ──
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Aureval API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// ── Error Handler ──
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════╗');
  console.log(`║   AUREVAL API  →  http://localhost:${PORT} ║`);
  console.log('╚══════════════════════════════════════╝\n');
});

module.exports = app;
