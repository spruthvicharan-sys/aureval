import { useEffect, useRef, useState } from 'react';

function scoreColor(v) {
  if (v >= 80) return '#00d4aa';
  if (v >= 60) return '#ff9f1c';
  return '#e53e3e';
}

const METRICS = [
  { key: 'correctness',   label: 'Correctness',   sub: 'Factual accuracy' },
  { key: 'hallucination', label: 'Hallucination',  sub: 'Fabrication detection' },
  { key: 'consistency',   label: 'Consistency',    sub: 'Logic & coherence' },
  { key: 'completeness',  label: 'Completeness',   sub: 'Coverage depth' },
  { key: 'clarity',       label: 'Clarity',        sub: 'Communication quality' },
];

function Bar({ value, delay }) {
  const [w, setW]   = useState(0);
  const [n, setN]   = useState(0);
  const col         = scoreColor(value);
  const rafRef      = useRef(null);

  useEffect(() => {
    const tid = setTimeout(() => {
      let start = null;
      const dur = 1100;
      function step(ts) {
        if (!start) start = ts;
        const p    = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setW(ease * value);
        setN(Math.round(ease * value));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
      }
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(rafRef.current); };
  }, [value, delay]);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'116px 1fr 40px', alignItems:'center', gap:12,
      animation:`slide-up 0.45s ease both`, animationDelay:`${delay}ms` }}>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:'#e8eaf0' }}>{METRICS.find(m=>m.value===value)?.label || ''}</div>
      </div>
      <div style={{ height:6, background:'rgba(255,255,255,0.07)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${w}%`, background:col, borderRadius:3, transition:'none' }} />
      </div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:col, textAlign:'right' }}>{n}%</div>
    </div>
  );
}

export default function MetricBars({ scores }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {METRICS.map((m, i) => {
        const value = Math.round(scores?.[m.key] ?? 0);
        const col   = scoreColor(value);
        const [w, setW]   = useState(0);
        return null; // handled below
      })}
      {METRICS.map((m, i) => {
        const value = Math.round(scores?.[m.key] ?? 0);
        return <MetricRow key={m.key} metric={m} value={value} delay={i * 90} />;
      })}
    </div>
  );
}

function MetricRow({ metric, value, delay }) {
  const [w, setW] = useState(0);
  const [n, setN] = useState(0);
  const col       = scoreColor(value);
  const rafRef    = useRef(null);

  useEffect(() => {
    setW(0); setN(0);
    const tid = setTimeout(() => {
      let start = null;
      const dur = 1100;
      function step(ts) {
        if (!start) start = ts;
        const p    = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setW(ease * value);
        setN(Math.round(ease * value));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
      }
      rafRef.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(tid); cancelAnimationFrame(rafRef.current); };
  }, [value, delay]);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'116px 1fr 40px', alignItems:'center', gap:12,
      animation:`slide-up 0.45s ease both`, animationDelay:`${delay}ms` }}>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:'#e8eaf0' }}>{metric.label}</div>
        <div style={{ fontSize:10, color:'#4a5568', marginTop:1 }}>{metric.sub}</div>
      </div>
      <div style={{ height:6, background:'rgba(255,255,255,0.07)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${w}%`, background:col, borderRadius:3, transition:'none' }} />
      </div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:col, textAlign:'right' }}>{n}%</div>
    </div>
  );
}
