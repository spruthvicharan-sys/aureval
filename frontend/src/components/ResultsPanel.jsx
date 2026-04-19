import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreRing from './ScoreRing';
import MetricBars from './MetricBars';

function scoreColor(v) {
  if (v >= 80) return '#00d4aa';
  if (v >= 60) return '#ff9f1c';
  return '#e53e3e';
}

function verdictBadge(v) {
  if (v >= 80) return { label:'✓ Strong Response',    bg:'rgba(0,212,170,0.1)',  border:'rgba(0,212,170,0.3)',  color:'#00d4aa' };
  if (v >= 60) return { label:'⚠ Acceptable',         bg:'rgba(255,159,28,0.1)', border:'rgba(255,159,28,0.3)', color:'#ff9f1c' };
  return            { label:'✗ Poor Quality',         bg:'rgba(229,62,62,0.1)',  border:'rgba(229,62,62,0.3)',  color:'#e53e3e' };
}

const TABS = ['Analysis', 'Issues', 'Strengths', 'Response'];

export default function ResultsPanel({ result, aiResponse, isEvaluating }) {
  const [tab, setTab] = useState('Analysis');

  if (!isEvaluating && !result) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        minHeight:480, gap:18, color:'#4a5568', textAlign:'center', padding:40 }}>
        <motion.div animate={{ y:[0,-10,0] }} transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.07)" strokeWidth="2"/>
            {[0,1,2].map(i => (
              <circle key={i} cx="32" cy="32" r={14+i*6} fill="none"
                stroke={`rgba(255,107,53,${0.22 - i*0.07})`} strokeWidth="1"
                strokeDasharray="3 3"
                style={{ animation:`spin ${8+i*4}s linear infinite`, transformOrigin:'32px 32px' }}
              />
            ))}
            <circle cx="32" cy="32" r="5" fill="rgba(255,107,53,0.4)"/>
          </svg>
        </motion.div>
        <p style={{ fontSize:13, lineHeight:1.8 }}>Enter a prompt and AI response<br/>to begin evaluation</p>
      </div>
    );
  }

  if (isEvaluating) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        minHeight:480, gap:28, padding:40 }}>
        <LoadingRings />
        <LoadingSteps />
      </div>
    );
  }

  const overall = Math.round(result.overall ?? 0);
  const badge   = verdictBadge(overall);

  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, ease:[0.4,0,0.2,1] }}
      style={{ padding:24 }}
    >
      {/* Top row */}
      <div style={{ display:'flex', gap:20, alignItems:'center', marginBottom:24 }}>
        <ScoreRing value={overall} size={118} strokeWidth={8} />
        <div style={{ flex:1 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:'#fff', marginBottom:6 }}>
            {result.headline}
          </h3>
          <p style={{ fontSize:13, color:'#8891a4', lineHeight:1.7, marginBottom:10 }}>{result.summary}</p>
          <span style={{
            display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:1,
            textTransform:'uppercase', padding:'4px 14px', borderRadius:999,
            background:badge.bg, border:`1px solid ${badge.border}`, color:badge.color,
            animation:'pop-in 0.4s var(--bounce)',
          }}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Metric bars */}
      <div style={{ marginBottom:22 }}>
        <MetricBars scores={result.scores} />
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, padding:4, background:'rgba(255,255,255,0.03)',
        borderRadius:'var(--r)', marginBottom:14 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:'7px 6px', borderRadius:8,
            border:'none', background: tab===t ? 'rgba(255,107,53,0.13)' : 'transparent',
            color: tab===t ? '#ff6b35' : '#4a5568',
            fontSize:11, fontWeight:600, letterSpacing:0.5, textTransform:'uppercase',
            cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
            transition:'all 0.2s',
          }}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
          transition={{ duration:0.2 }}>
          {tab === 'Analysis' && (
            <div style={{
              fontSize:13, color:'#8891a4', lineHeight:1.8, padding:14,
              background:'rgba(255,255,255,0.02)', borderRadius:'var(--r)',
              border:'1px solid rgba(255,255,255,0.07)',
            }}>
              {result.verdict}
            </div>
          )}

          {tab === 'Issues' && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {result.issues?.length > 0 ? result.issues.map((iss, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display:'flex', gap:10, padding:'10px 12px',
                    background:'rgba(255,255,255,0.02)',
                    border:`1px solid rgba(255,255,255,0.07)`,
                    borderLeft:`3px solid ${iss.severity==='high'?'#e53e3e':iss.severity==='medium'?'#ff9f1c':'#00d4aa'}`,
                    borderRadius:'var(--r)', fontSize:12, color:'#8891a4', lineHeight:1.6,
                  }}>
                  <span style={{
                    fontSize:10, fontWeight:700, letterSpacing:1, textTransform:'uppercase',
                    minWidth:44, paddingTop:2,
                    color: iss.severity==='high'?'#e53e3e':iss.severity==='medium'?'#ff9f1c':'#00d4aa',
                  }}>
                    {iss.severity?.toUpperCase()}
                  </span>
                  <span>{iss.text}</span>
                </motion.div>
              )) : (
                <div style={{ textAlign:'center', color:'#4a5568', fontSize:13, padding:'24px 0' }}>
                  ✓ No significant issues detected
                </div>
              )}
            </div>
          )}

          {tab === 'Strengths' && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {result.strengths?.length > 0 ? result.strengths.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display:'flex', gap:10, padding:'10px 12px',
                    background:'rgba(0,212,170,0.04)',
                    border:'1px solid rgba(0,212,170,0.15)',
                    borderLeft:'3px solid #00d4aa',
                    borderRadius:'var(--r)', fontSize:13, color:'#8891a4', lineHeight:1.6,
                  }}>
                  <span style={{ color:'#00d4aa' }}>✓</span>
                  {s}
                </motion.div>
              )) : (
                <div style={{ textAlign:'center', color:'#4a5568', fontSize:13, padding:'24px 0' }}>
                  No strengths listed
                </div>
              )}
              {result.recommendation && (
                <div style={{
                  marginTop:8, padding:'10px 14px',
                  background:'rgba(255,107,53,0.05)',
                  border:'1px solid rgba(255,107,53,0.15)',
                  borderRadius:'var(--r)', fontSize:12, color:'#8891a4',
                }}>
                  <span style={{ color:'#ff9f1c', fontWeight:600, display:'block', marginBottom:4 }}>
                    💡 Recommendation
                  </span>
                  {result.recommendation}
                </div>
              )}
            </div>
          )}

          {tab === 'Response' && (
            <pre style={{
              fontFamily:"'DM Mono',monospace", fontSize:12, lineHeight:1.8,
              color:'#8891a4', padding:14,
              background:'rgba(255,255,255,0.02)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:'var(--r)',
              maxHeight:200, overflowY:'auto', whiteSpace:'pre-wrap', wordBreak:'break-word',
            }}>
              {aiResponse}
            </pre>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{
        textAlign:'center', marginTop:16, paddingTop:14,
        borderTop:'1px solid rgba(255,255,255,0.06)',
        fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'rgba(255,107,53,0.45)',
      }}>
        ⚡ POWERED BY AUREVAL ENGINE
      </div>
    </motion.div>
  );
}

function LoadingRings() {
  return (
    <div style={{ position:'relative', width:80, height:80 }}>
      {[
        { inset:0, color:'#ff6b35', dur:'1s' },
        { inset:10, color:'#ff9f1c', dur:'1.5s', reverse:true },
        { inset:20, color:'#00d4aa', dur:'2s' },
      ].map((r, i) => (
        <div key={i} style={{
          position:'absolute',
          top:r.inset, left:r.inset, right:r.inset, bottom:r.inset,
          borderRadius:'50%',
          border:`2px solid transparent`,
          borderTopColor: r.color,
          animation:`spin ${r.dur} linear infinite ${r.reverse?'reverse':''}`,
        }}/>
      ))}
    </div>
  );
}

function LoadingSteps() {
  const steps = [
    'Parsing prompt context…',
    'Checking factual claims…',
    'Scanning for hallucinations…',
    'Computing quality scores…',
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {steps.map((s, i) => (
        <motion.div key={s}
          initial={{ opacity:0, x:-10 }}
          animate={{ opacity:1, x:0 }}
          transition={{ delay: i * 0.9, duration:0.4 }}
          style={{
            fontSize:12, fontFamily:"'DM Mono',monospace",
            color:'#4a5568',
          }}>
          <motion.span
            animate={{ color:['#4a5568','#ff6b35','#00d4aa'] }}
            transition={{ delay: i * 0.9, duration:0.8 }}
          >
            ⬤
          </motion.span>
          {' '}{s}
        </motion.div>
      ))}
    </div>
  );
}
