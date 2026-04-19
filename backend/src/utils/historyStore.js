// Simple in-memory store for evaluation history
// In production, replace with a real database (PostgreSQL, MongoDB, etc.)

const history = [];
const MAX_ENTRIES = 100;

const store = {
  add(entry) {
    history.unshift(entry);
    if (history.length > MAX_ENTRIES) history.splice(MAX_ENTRIES);
    return entry;
  },
  getAll() {
    return history;
  },
  getById(id) {
    return history.find(e => e.id === id) || null;
  },
  delete(id) {
    const idx = history.findIndex(e => e.id === id);
    if (idx === -1) return false;
    history.splice(idx, 1);
    return true;
  },
  clear() {
    history.length = 0;
  },
  count() {
    return history.length;
  }
};

module.exports = store;
