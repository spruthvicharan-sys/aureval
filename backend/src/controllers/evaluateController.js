const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../utils/anthropicClient');
const store = require('../utils/historyStore');

const EVAL_SYSTEM_PROMPT = `You are Aureval, a rigorous AI response quality evaluator used by researchers and AI engineers.
Your evaluations must be precise, critical, and actionable.

Return ONLY a valid JSON object with no markdown, no backticks, no explanatory text before or after:
{
  "overall": <integer 0-100>,
  "scores": {
    "correctness": <integer 0-100>,
    "hallucination": <integer 0-100>,
    "consistency": <integer 0-100>,
    "completeness": <integer 0-100>,
    "clarity": <integer 0-100>
  },
  "headline": "<5-8 word verdict>",
  "summary": "<2-3 precise sentences>",
  "verdict": "<one detailed paragraph covering strengths and weaknesses>",
  "issues": [
    { "severity": "high|medium|low", "category": "Factual|Hallucination|Logic|Coverage|Clarity", "text": "<specific issue>" }
  ],
  "strengths": ["<strength 1>", "<strength 2>"],
  "recommendation": "<one sentence on what to improve>"
}

Scoring rubric:
- correctness: factual accuracy (100 = all facts verifiable and correct)
- hallucination: 100 = zero fabrications; 0 = severe invented content
- consistency: internal logic and coherence (100 = no contradictions)
- completeness: prompt coverage (100 = all aspects addressed)
- clarity: expression quality (100 = perfectly clear and structured)

Rules:
- A score ≥ 90 is exceptional. Be rigorous.
- Max 4 issues. Empty array if genuinely no issues.
- Max 3 strengths.
- If no reference answer is given, evaluate based on general knowledge.`;

async function runEvaluation(prompt, aiResponse, reference) {
  const client = getClient();

  const userMsg = [
    `PROMPT:\n${prompt}`,
    `\nAI RESPONSE TO EVALUATE:\n${aiResponse}`,
    reference ? `\nREFERENCE ANSWER:\n${reference}` : ''
  ].join('');

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1200,
    messages: [
      { role: 'system', content: EVAL_SYSTEM_PROMPT },
      { role: 'user',   content: userMsg }
    ]
  });

  const raw   = completion.choices[0]?.message?.content || '';
  const clean = raw.replace(/```json|```/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Failed to parse evaluation JSON from model response');
    parsed = JSON.parse(match[0]);
  }

  return parsed;
}

const evaluate = async (req, res, next) => {
  try {
    const { prompt, aiResponse, reference = '' } = req.body;

    if (!prompt?.trim()) return res.status(400).json({ error: 'prompt is required' });
    if (!aiResponse?.trim()) return res.status(400).json({ error: 'aiResponse is required' });
    if (prompt.length > 2000) return res.status(400).json({ error: 'prompt too long (max 2000 chars)' });
    if (aiResponse.length > 8000) return res.status(400).json({ error: 'aiResponse too long (max 8000 chars)' });

    const startTime = Date.now();
    const result = await runEvaluation(prompt.trim(), aiResponse.trim(), reference.trim());
    const durationMs = Date.now() - startTime;

    const entry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      durationMs,
      prompt: prompt.trim(),
      aiResponse: aiResponse.trim(),
      reference: reference.trim() || null,
      result
    };

    store.add(entry);

    res.json({
      success: true,
      id: entry.id,
      timestamp: entry.timestamp,
      durationMs,
      result
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { evaluate };
