const store = require('../utils/historyStore');

const getHistory = (req, res) => {
  const all = store.getAll();
  // Return summary (no full aiResponse text to keep payload small)
  const summary = all.map(({ id, timestamp, durationMs, prompt, result }) => ({
    id,
    timestamp,
    durationMs,
    prompt: prompt.length > 120 ? prompt.slice(0, 120) + '…' : prompt,
    overall: result?.overall ?? null,
    headline: result?.headline ?? null,
  }));
  res.json({ success: true, count: summary.length, items: summary });
};

const getOne = (req, res) => {
  const entry = store.getById(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  res.json({ success: true, entry });
};

const deleteOne = (req, res) => {
  const deleted = store.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Entry not found' });
  res.json({ success: true, message: 'Deleted' });
};

const clearHistory = (req, res) => {
  store.clear();
  res.json({ success: true, message: 'History cleared' });
};

module.exports = { getHistory, getOne, deleteOne, clearHistory };
