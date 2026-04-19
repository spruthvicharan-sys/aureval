import { useEffect, useRef, useState } from 'react';

function scoreColor(v) {
  if (v >= 80) return '#00d4aa';
  if (v >= 60) return '#ff9f1c';
  return '#e53e3e';
}

export default function ScoreRing({ value = 0, size = 120, strokeWidth = 8, animate = true }) {
  const [displayed, setDisplayed] = useState(0);
  const [offset, setOffset]       = useState(0);
  const rafRef = useRef(null);

  const r    = (size / 2) - strokeWidth;
  const circ = 2 * Math.PI * r;
  const col  = scoreColor(value);

  useEffect(() => {
    if (!animate) { setDisplayed(value); setOffset(circ - (value / 100) * circ); return; }
    let start = null;
    const dur = 1300;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = Math.round(ease * value);
      setDisplayed(v);
      setOffset(circ - (v / 100) * circ);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, circ, animate]);

  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block' }}>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={col} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: animate ? 'none' : 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
      }}>
        <span style={{
          fontFamily:"'Syne',sans-serif", fontWeight:800,
          fontSize: size > 100 ? 28 : 20, color: col, lineHeight:1,
          animation:'count-up 0.4s ease',
        }}>
          {displayed}%
        </span>
        <span style={{ fontSize:9, color:'#4a5568', letterSpacing:1.5, textTransform:'uppercase', marginTop:2 }}>
          Overall
        </span>
      </div>
    </div>
  );
}
