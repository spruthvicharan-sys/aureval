# ⚡ Aureval — AI Response Evaluation Platform

> Detect hallucinations. Measure correctness. Score consistency.  
> Full-stack app powered by **Node.js + Express** (backend) and **React + Vite + Framer Motion** (frontend).

---

## 🗂 Project Structure

```
aureval/
├── backend/                     # Node.js / Express API
│   ├── src/
│   │   ├── server.js            # Entry point
│   │   ├── routes/
│   │   │   ├── evaluate.js      # POST /api/evaluate
│   │   │   ├── generate.js      # POST /api/generate
│   │   │   └── history.js       # GET/DELETE /api/history
│   │   ├── controllers/
│   │   │   ├── evaluateController.js
│   │   │   ├── generateController.js
│   │   │   └── historyController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   └── utils/
│   │       ├── anthropicClient.js
│   │       └── historyStore.js  # In-memory store (swap for DB in prod)
│   ├── .env.example
│   └── package.json
│
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── main.jsx             # Entry point
│   │   ├── App.jsx              # Router + layout
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Hero + features
│   │   │   ├── Evaluate.jsx     # Main evaluator UI
│   │   │   └── History.jsx      # Session history
│   │   ├── components/
│   │   │   ├── ParticleCanvas.jsx
│   │   │   ├── Cursor.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScoreRing.jsx    # Animated SVG ring
│   │   │   ├── MetricBars.jsx   # Animated metric bars
│   │   │   └── ResultsPanel.jsx
│   │   ├── hooks/
│   │   │   └── useEvaluator.js
│   │   ├── utils/
│   │   │   ├── api.js           # Axios API client
│   │   │   └── store.js         # Zustand global state
│   │   └── styles/
│   │       └── globals.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                 # Root: runs both with concurrently
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# From the aureval/ root directory:
npm install           # installs concurrently
npm run install:all   # installs backend + frontend deps
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env and set your ANTHROPIC_API_KEY
```

```env
PORT=4000
ANTHROPIC_API_KEY=sk-ant-...
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Get your API key from → https://console.anthropic.com/

### 3. Run in Development

```bash
# From root:
npm run dev
```

This starts:
- **Backend API** → http://localhost:4000
- **Frontend UI** → http://localhost:5173

---

## 🔌 API Reference

### `POST /api/evaluate`
Evaluates an AI response across 5 dimensions.

**Request:**
```json
{
  "prompt":     "What is the speed of light?",
  "aiResponse": "Light travels at 300,000 km/s...",
  "reference":  "(optional) Known-correct answer"
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid",
  "timestamp": "ISO string",
  "durationMs": 2340,
  "result": {
    "overall": 88,
    "scores": {
      "correctness":   94,
      "hallucination": 90,
      "consistency":   92,
      "completeness":  78,
      "clarity":       91
    },
    "headline":       "Accurate but slightly incomplete",
    "summary":        "...",
    "verdict":        "...",
    "issues":         [{ "severity": "medium", "category": "Coverage", "text": "..." }],
    "strengths":      ["Clear explanation", "..."],
    "recommendation": "..."
  }
}
```

### `POST /api/generate`
Generates an AI response to a prompt.

```json
{ "prompt": "Explain recursion" }
```

### `GET /api/history`
Returns all evaluation summaries for the session.

### `DELETE /api/history/:id`
Deletes a single history entry.

### `DELETE /api/history/clear`
Clears all history.

### `GET /health`
Health check endpoint.

---

## ✨ Features

| Feature | Details |
|---|---|
| **5-Dimension Evaluation** | Correctness, Hallucination, Consistency, Completeness, Clarity |
| **AI Response Generation** | Generate a response to evaluate in one click |
| **Animated Score Ring** | Smooth SVG ring with eased counter |
| **Animated Metric Bars** | Staggered bar fills with live percentage |
| **Analysis Tabs** | Analysis · Issues · Strengths · Response |
| **Session History** | Persist evaluations across page navigations |
| **Particle Canvas** | Interactive WebGL-like particle system |
| **Custom Cursor** | Smooth tracking cursor with hover states |
| **Framer Motion** | Page transitions, staggered reveals, micro-animations |
| **Rate Limiting** | 20 req/min per IP on all API routes |
| **Error Handling** | Centralized error middleware with user-friendly messages |

---

## 🛠 Tech Stack

**Backend**
- Node.js + Express
- `@anthropic-ai/sdk` — Claude claude-opus-4-5
- `helmet`, `cors`, `morgan` — Security & logging
- `express-rate-limit` — Rate limiting
- `uuid` — Unique evaluation IDs

**Frontend**
- React 18 + Vite
- `framer-motion` — Animations & transitions
- `zustand` — Lightweight global state
- `axios` — HTTP client with interceptors
- `react-hot-toast` — Notifications
- `react-router-dom` v6 — Client-side routing

---

## 📦 Production Build

```bash
npm run build          # Builds frontend to frontend/dist/
npm run start          # Runs backend + frontend preview
```

To serve frontend from Express in production, add this to `backend/src/server.js`:
```js
const path = require('path');
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../frontend/dist/index.html')));
```
