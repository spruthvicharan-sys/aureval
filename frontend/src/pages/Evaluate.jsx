import { motion } from 'framer-motion';
import { useStore } from '../utils/store';
import { useEvaluator } from '../hooks/useEvaluator';
import ResultsPanel from '../components/ResultsPanel';

const EXAMPLES = [
  {
    prompt: 'What is the speed of light in a vacuum?',
    aiResponse: "The speed of light in a vacuum is exactly 300,000 km/s, denoted as 'c'. According to Einstein's special relativity, nothing can exceed this speed. It's a fundamental constant of the universe.",
    reference: 'The speed of light in a vacuum is exactly 299,792,458 m/s (~300,000 km/s), denoted as c.',
  },
  {
    prompt: 'Explain Python recursion with an example',
    aiResponse: "Recursion is when a function calls itself. Example:\n\ndef factorial(n):\n    if n == 0: return 1\n    return n * factorial(n-1)\n\nPython has a default recursion limit of 1000 to prevent infinite loops. Tail recursion isn't optimized in Python.",
    reference: '',
  },
  {
    prompt: 'When and where did Napoleon Bonaparte die?',
    aiResponse: 'Napoleon Bonaparte died on May 5, 1821, on the island of Saint Helena in the South Atlantic Ocean. He was exiled there by the British after his defeat at Waterloo in 1815. Some historians suspect arsenic poisoning based on hair analysis.',
    reference: '',
  },
];

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: '#e8eaf0',
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 13,
  lineHeight: 1.7,
  padding: '12px 14px',
  resize: 'vertical',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function Evaluate() {
  const {
    prompt, aiResponse, reference,
    setPrompt, setAiResponse, setReference,
    result, isEvaluating, isGenerating,
    clearForm,
  } = useStore();
  const { generate, evaluate } = useEvaluator();

  const loadExample = (ex) => {
    setPrompt(ex.prompt);
    setAiResponse(ex.aiResponse);
    setReference(ex.reference);
  };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 32px 80px' }}>

        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}
          style={{ textAlign:'center', marginBottom:44 }}
        >
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(28px,4vw,44px)', fontWeight:800, color:'#fff', lineHeight:1.1 }}>
            <span className="g-text">Aureval</span> Evaluation Engine
          </h1>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:22 }}>

          {/* ── INPUT PANEL ── */}
          <motion.div
            initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.55, delay:0.1 }}
            style={{
              background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:18, overflow:'hidden',
            }}
          >
            {/* Panel header */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 20px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display:'flex', gap:6 }}>
                {['rgba(255,255,255,0.1)','rgba(255,255,255,0.1)','rgba(255,255,255,0.1)'].map((c,i) => (
                  <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>
                ))}
              </div>
              <span style={{ fontSize:11, color:'#4a5568', letterSpacing:2, textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>Input</span>
            </div>

            {/* Quick examples */}
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize:10, color:'#4a5568', letterSpacing:1, textTransform:'uppercase' }}>Examples:</span>
              {['Speed of Light','Python Code','Napoleon'].map((label, i) => (
                <button key={label} onClick={() => loadExample(EXAMPLES[i])} style={{
                  padding:'4px 12px', borderRadius:999,
                  background:'transparent', border:'1px solid rgba(255,255,255,0.08)',
                  color:'#8891a4', fontSize:11, fontWeight:500, cursor:'pointer',
                  fontFamily:"'DM Sans',sans-serif",
                  transition:'all 0.2s',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#ff6b35';e.currentTarget.style.color='#ff9f1c'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='#8891a4'}}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ padding:'0 20px' }}>
              {/* Prompt */}
              <div style={{ paddingTop:16, paddingBottom:0 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, letterSpacing:1.2, color:'#8891a4', textTransform:'uppercase', marginBottom:7 }}>Your Prompt</label>
                <textarea rows={3} value={prompt} onChange={e=>setPrompt(e.target.value)}
                  placeholder="e.g. What is the speed of light in a vacuum?"
                  style={inputStyle}
                  onFocus={e=>{e.target.style.borderColor='rgba(255,107,53,0.4)';e.target.style.boxShadow='0 0 0 3px rgba(255,107,53,0.08)'}}
                  onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)';e.target.style.boxShadow=''}}
                />
              </div>

              {/* AI Response */}
              <div style={{ paddingTop:14 }}>
                <label style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11, fontWeight:600, letterSpacing:1.2, color:'#8891a4', textTransform:'uppercase', marginBottom:7 }}>
                  AI Response to Evaluate
                  <button onClick={generate} disabled={isGenerating} style={{
                    display:'inline-flex', alignItems:'center', gap:5,
                    padding:'4px 12px', borderRadius:999,
                    background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                    color: isGenerating ? '#4a5568' : '#8891a4',
                    fontSize:10, fontWeight:600, cursor: isGenerating ? 'not-allowed' : 'pointer',
                    fontFamily:"'DM Sans',sans-serif", textTransform:'uppercase', letterSpacing:0.5,
                    transition:'all 0.2s',
                  }}
                    onMouseEnter={e=>{ if(!isGenerating){e.currentTarget.style.borderColor='#00d4aa';e.currentTarget.style.color='#00d4aa'} }}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.color='#8891a4'}}
                  >
                    {isGenerating
                      ? <><span style={{ width:10, height:10, border:'1.5px solid rgba(255,255,255,0.2)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }}/> Generating…</>
                      : '⚡ Generate'
                    }
                  </button>
                </label>
                <textarea rows={6} value={aiResponse} onChange={e=>setAiResponse(e.target.value)}
                  placeholder="Paste the AI-generated response you want to evaluate..."
                  style={inputStyle}
                  onFocus={e=>{e.target.style.borderColor='rgba(255,107,53,0.4)';e.target.style.boxShadow='0 0 0 3px rgba(255,107,53,0.08)'}}
                  onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)';e.target.style.boxShadow=''}}
                />
              </div>

              {/* Reference */}
              <div style={{ paddingTop:14 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:11, fontWeight:600, letterSpacing:1.2, color:'#8891a4', textTransform:'uppercase', marginBottom:7 }}>
                  Reference Answer
                  <span style={{ fontSize:9, color:'#4a5568', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(optional)</span>
                </label>
                <textarea rows={3} value={reference} onChange={e=>setReference(e.target.value)}
                  placeholder="Provide a known-correct answer for precision comparison..."
                  style={inputStyle}
                  onFocus={e=>{e.target.style.borderColor='rgba(255,107,53,0.4)';e.target.style.boxShadow='0 0 0 3px rgba(255,107,53,0.08)'}}
                  onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)';e.target.style.boxShadow=''}}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:10, padding:'16px 20px 20px' }}>
              <button onClick={clearForm} style={{
                width:44, height:44, borderRadius:10, flexShrink:0,
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                color:'#8891a4', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.2s', fontSize:16,
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#e53e3e';e.currentTarget.style.color='#e53e3e';e.currentTarget.style.background='rgba(229,62,62,0.08)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='#8891a4';e.currentTarget.style.background='rgba(255,255,255,0.04)'}}
                title="Clear"
              >
                🗑
              </button>
              <button onClick={evaluate} disabled={isEvaluating} style={{
                flex:1, height:44, borderRadius:10,
                background: isEvaluating ? 'rgba(255,107,53,0.4)' : 'linear-gradient(135deg,#ff6b35,#ff9f1c)',
                border:'none', color:'#fff', fontSize:14, fontWeight:700,
                cursor: isEvaluating ? 'not-allowed' : 'pointer',
                fontFamily:"'DM Sans',sans-serif",
                position:'relative', overflow:'hidden',
                boxShadow: isEvaluating ? 'none' : '0 4px 24px rgba(255,107,53,0.32)',
                transition:'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e=>{ if(!isEvaluating){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(255,107,53,0.5)'} }}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 24px rgba(255,107,53,0.32)'}}
              >
                <span style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {isEvaluating
                    ? <><span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }}/> Analyzing…</>
                    : '★ Evaluate Response'
                  }
                </span>
                {!isEvaluating && <div style={{ position:'absolute', top:0, left:'-80%', width:'60%', height:'100%', background:'rgba(255,255,255,0.2)', transform:'skewX(-20deg)', animation:'shimmer 3s ease-in-out infinite' }}/>}
              </button>
            </div>
          </motion.div>

          {/* ── RESULTS PANEL ── */}
          <motion.div
            initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.55, delay:0.15 }}
            style={{
              background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:18, overflow:'hidden',
              minHeight:480,
            }}
          >
            {/* Panel header */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 20px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display:'flex', gap:6 }}>
                {['#ff5f57','#febc2e','#28c840'].map((c,i) => (
                  <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>
                ))}
              </div>
              <span style={{ fontSize:11, color:'#4a5568', letterSpacing:2, textTransform:'uppercase', fontFamily:"'DM Mono',monospace" }}>Results</span>
              {result && <span style={{ marginLeft:'auto', fontSize:10, color:'#00d4aa', letterSpacing:1 }}>● COMPLETE</span>}
              {isEvaluating && <span style={{ marginLeft:'auto', fontSize:10, color:'#ff9f1c', letterSpacing:1 }}>◌ PROCESSING</span>}
            </div>

            <ResultsPanel result={result} aiResponse={aiResponse} isEvaluating={isEvaluating} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
