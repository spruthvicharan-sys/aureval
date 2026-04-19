import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../utils/store';
import * as api from '../utils/api';

export function useEvaluator() {
  const {
    prompt, aiResponse, reference,
    setAiResponse, setResult, setEvaluating, setGenerating,
    addToHistory,
  } = useStore();

  const generate = useCallback(async () => {
    if (!prompt.trim()) { toast.error('Enter a prompt first'); return; }
    setGenerating(true);
    try {
      const data = await api.generateResponse({ prompt });
      setAiResponse(data.response);
      toast.success('Response generated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  }, [prompt, setAiResponse, setGenerating]);

  const evaluate = useCallback(async () => {
    if (!prompt.trim())      { toast.error('Prompt is required');   return; }
    if (!aiResponse.trim())  { toast.error('AI response is required'); return; }
    setEvaluating(true);
    setResult(null, null);
    try {
      const data = await api.evaluateResponse({ prompt, aiResponse, reference });
      setResult(data.result, data.id);
      addToHistory({
        id:        data.id,
        timestamp: data.timestamp,
        durationMs: data.durationMs,
        prompt:    prompt.length > 120 ? prompt.slice(0, 120) + '…' : prompt,
        overall:   data.result?.overall ?? null,
        headline:  data.result?.headline ?? null,
      });
      toast.success('Evaluation complete');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEvaluating(false);
    }
  }, [prompt, aiResponse, reference, setResult, setEvaluating, addToHistory]);

  return { generate, evaluate };
}
