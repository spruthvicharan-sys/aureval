import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Evaluator state
  prompt: '',
  aiResponse: '',
  reference: '',
  result: null,
  isEvaluating: false,
  isGenerating: false,
  evalId: null,

  setPrompt: (v) => set({ prompt: v }),
  setAiResponse: (v) => set({ aiResponse: v }),
  setReference: (v) => set({ reference: v }),
  setResult: (result, id) => set({ result, evalId: id }),
  setEvaluating: (v) => set({ isEvaluating: v }),
  setGenerating: (v) => set({ isGenerating: v }),
  clearForm: () => set({ prompt: '', aiResponse: '', reference: '', result: null, evalId: null }),

  // History
  history: [],
  setHistory: (history) => set({ history }),
  addToHistory: (entry) => set(s => ({ history: [entry, ...s.history] })),
  removeFromHistory: (id) => set(s => ({ history: s.history.filter(e => e.id !== id) })),
}));
