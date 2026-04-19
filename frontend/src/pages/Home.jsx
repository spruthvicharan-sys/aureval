import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const fade  = (delay=0) => ({ initial:{opacity:0,y:32}, animate:{opacity:1,y:0}, transition:{duration:0.7, delay, ease:[0.4,0,0.2,1]} });
const FEATURES = [
  { icon:'✓', color:'#00d4aa', title:'Correctness',   desc:'Verifies every factual claim. Cross-references known truths for ironclad accuracy scoring.', tag:'Factual Accuracy' },
  { icon:'⚠', color:'#ff6b35', title:'Hallucination', desc:'Detects fabricated information, invented citations, and unsupported claims.', tag:'Fabrication Detection' },
  { icon:'≡', color:'#7c6af7', title:'Consistency',   desc:'Analyzes internal logic and catches contradictions within the response.', tag:'Logic Analysis' },
  { icon:'◎', color:'#ff9f1c', title:'Completeness',  desc:'Measures whether all aspects of the prompt are addressed thoroughly.', tag:'Coverage Depth' },
  { icon:'✎', color:'#00d4aa', title:'Clarity',       desc:'Scores readability, expression quality, and communicative effectiveness.', tag:'Communication' },
];

export default function Home() {
  const demoRef = useRef(null);

  useEffect(() => {
    const fills = demoRef.current?.querySelectorAll('.demo-fill');
    if (!fills) return;
    const ob = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fills.forEach((el, i) => {
          setTimeout(() => { el.style.width = el.dataset.w; }, 200 + i * 130);
        });
        ob.disconnect();
      }
    }, { threshold: 0.5 });
    ob.observe(demoRef.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', padding:'120px 32px 80px' }}>
        {/* Orbs */}
        {[
          { color:'#ff6b35', top:'-160px', left:'-120px', w:580, h:580, anim:'orb1 14s infinite alternate' },
          { color:'#00d4aa', bottom:'-100px', right:'-100px', w:480, h:480, anim:'orb2 18s infinite alternate' },
          { color:'#7c6af7', top:'40%', left:'42%', w:320, h:320, anim:'orb3 22s infinite alternate' },
        ].map((o,i) => (
          <div key={i} style={{
            position:'absolute', borderRadius:'50%',
            width:o.w, height:o.h,
            background:`radial-gradient(circle,${o.color},transparent)`,
            filter:'blur(90px)', opacity:0.11,
            top:o.top, left:o.left, right:o.right, bottom:o.bottom,
            animation:o.anim,
          }}/>
        ))}
        {/* Grid */}
        <div style={{
          position:'absolute', inset:0, zIndex:0,
          backgroundImage:'linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)',
          backgroundSize:'56px 56px',
          maskImage:'radial-gradient(ellipse at 50% 50%,black 35%,transparent 75%)',
        }}/>

        <div style={{ position:'relative', zIndex:1, maxWidth:1160, margin:'0 auto', width:'100%', display:'flex', alignItems:'center', gap:60 }}>
          {/* LEFT */}
          <div style={{ flex:1, maxWidth:560 }}>
            <motion.div {...fade(0.05)} style={{
              display:'inline-flex', alignItems:'center', gap:8, padding:'7px 16px',
              background:'rgba(255,107,53,0.1)', border:'1px solid rgba(255,107,53,0.25)',
              borderRadius:999, fontSize:11, fontWeight:600, letterSpacing:1.2,
              color:'#ff9f1c', textTransform:'uppercase', marginBottom:26,
              animation:'badge-glow 3s ease-in-out infinite',
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#ff6b35', animation:'blink 2s ease-in-out infinite' }}/>
              AI Response Intelligence Engine
            </motion.div>

            <motion.h1 {...fade(0.1)} style={{
              fontFamily:"'Syne',sans-serif", fontSize:'clamp(38px,5.2vw,62px)',
              fontWeight:800, lineHeight:1.06, marginBottom:20,
            }}>
              <span style={{ color:'#fff' }}>Evaluate</span><br/>
              <span className="g-text">Any AI Response</span><br/>
              <span style={{ color:'rgba(255,255,255,0.7)' }}>In Seconds</span>
            </motion.h1>

            <motion.p {...fade(0.18)} style={{ fontSize:16, color:'#8891a4', lineHeight:1.85, marginBottom:36 }}>
              Detect hallucinations. Measure correctness. Score consistency.<br/>
              The professional evaluation layer every AI workflow needs.
            </motion.p>

            <motion.div {...fade(0.24)} style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:48 }}>
              <Link to="/evaluate" style={{
                display:'inline-flex', alignItems:'center', gap:10,
                padding:'14px 32px', borderRadius:999,
                background:'linear-gradient(135deg,#ff6b35,#ff9f1c)',
                color:'#fff', textDecoration:'none', fontSize:15, fontWeight:600,
                boxShadow:'0 6px 28px rgba(255,107,53,0.38)',
                position:'relative', overflow:'hidden',
              }}>
                <span style={{ position:'relative', zIndex:1 }}>⚡ Start Evaluating</span>
                <div style={{
                  position:'absolute', top:0, left:'-80%', width:'60%', height:'100%',
                  background:'rgba(255,255,255,0.22)', transform:'skewX(-20deg)',
                  animation:'shimmer 3.5s ease-in-out infinite',
                }}/>
              </Link>
              <a href="#features" style={{
                display:'inline-flex', alignItems:'center',
                padding:'14px 32px', borderRadius:999,
                border:'1px solid rgba(255,255,255,0.14)',
                color:'#8891a4', textDecoration:'none', fontSize:15, fontWeight:500,
                transition:'all 0.2s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#ff6b35';e.currentTarget.style.color='#fff'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.14)';e.currentTarget.style.color='#8891a4'}}
              >
                How It Works ↓
              </a>
            </motion.div>

            <motion.div {...fade(0.3)} style={{ display:'flex', gap:0, alignItems:'center' }}>
              {[['5','Eval Dimensions'],['AI','Powered Engine'],['<3s','Avg Eval Time']].map(([n,l],i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:0 }}>
                  {i > 0 && <div style={{ width:1, height:38, background:'rgba(255,255,255,0.08)', margin:'0 24px' }}/>}
                  <div style={{ paddingLeft: i===0?0:0 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#fff', lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:11, color:'#4a5568', marginTop:4, letterSpacing:0.4 }}>{l}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT – demo card */}
          <motion.div
            initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.8, delay:0.2, ease:[0.4,0,0.2,1] }}
            style={{ flexShrink:0 }}
          >
            <div ref={demoRef} style={{
              width:310,
              background:'rgba(13,16,23,0.92)',
              border:'1px solid rgba(255,255,255,0.09)',
              borderRadius:18, padding:20,
              backdropFilter:'blur(20px)',
              boxShadow:'0 32px 80px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)',
              animation:'float 6s ease-in-out infinite',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:18 }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => (
                  <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>
                ))}
                <span style={{ fontSize:10, color:'#4a5568', letterSpacing:1, textTransform:'uppercase', marginLeft:8 }}>Live Evaluation</span>
              </div>
              {[
                { label:'Correctness',   pct:94, color:'#00d4aa' },
                { label:'Hallucination', pct:88, color:'#7c6af7' },
                { label:'Consistency',   pct:92, color:'#ff9f1c' },
                { label:'Completeness',  pct:76, color:'#ff6b35' },
              ].map(m => (
                <div key={m.label} style={{ display:'grid', gridTemplateColumns:'88px 1fr 34px', alignItems:'center', gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:11, color:'#8891a4' }}>{m.label}</span>
                  <div style={{ height:6, background:'rgba(255,255,255,0.07)', borderRadius:3, overflow:'hidden' }}>
                    <div className="demo-fill" data-w={m.pct+'%'} style={{ height:'100%', width:0, background:m.color, borderRadius:3, transition:'width 1.2s cubic-bezier(0.4,0,0.2,1)' }}/>
                  </div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#fff' }}>{m.pct}%</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', margin:'14px 0 10px', position:'relative' }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="url(#dg)" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="213.6" strokeDashoffset="213.6"
                    transform="rotate(-90 40 40)"
                    style={{ animation:'ring-load 2s 0.8s cubic-bezier(0.4,0,0.2,1) forwards' }}
                  />
                  <defs>
                    <linearGradient id="dg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ff6b35"/><stop offset="100%" stopColor="#00d4aa"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position:'absolute', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'#00d4aa', lineHeight:1 }}>88%</div>
                  <div style={{ fontSize:9, color:'#4a5568', letterSpacing:1 }}>OVERALL</div>
                </div>
              </div>
              <div style={{ textAlign:'center', fontSize:11, color:'#00d4aa', padding:'7px 10px',
                background:'rgba(0,212,170,0.07)', borderRadius:8, border:'1px solid rgba(0,212,170,0.18)' }}>
                ✓ Strong response — minor completeness gap
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:36, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, color:'#4a5568', fontSize:10, letterSpacing:2, textTransform:'uppercase', zIndex:1 }}>
          <span>Scroll</span>
          <div style={{ width:1, height:46, background:'linear-gradient(to bottom,#4a5568,transparent)', animation:'scroll-line 2s ease-in-out infinite' }}/>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background:'#0d1017', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1160, margin:'0 auto', padding:'100px 32px' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <motion.div
              initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:'#ff6b35', textTransform:'uppercase', marginBottom:14 }}>
              What We Measure
            </motion.div>
            <motion.h2
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:0.6, delay:0.1 }}
              style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(30px,3.8vw,46px)', fontWeight:800, color:'#fff', lineHeight:1.15 }}>
              Five Dimensions of<br/><span className="g-text">Response Quality</span>
            </motion.h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:0.55, delay: i * 0.08 }}
                whileHover={{ y:-4, transition:{ duration:0.25 } }}
                style={{
                  background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:18, padding:26,
                  cursor:'default',
                }}
              >
                <div style={{
                  width:46, height:46, borderRadius:12,
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:20, color:f.color, marginBottom:16,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color:'#fff', marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:'#8891a4', lineHeight:1.7, marginBottom:14 }}>{f.desc}</p>
                <span style={{ fontSize:10, fontWeight:600, letterSpacing:1, color:'#4a5568', border:'1px solid rgba(255,255,255,0.08)', borderRadius:999, padding:'3px 10px', textTransform:'uppercase' }}>
                  {f.tag}
                </span>
              </motion.div>
            ))}

            {/* CTA card */}
            <motion.div
              initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.55, delay:0.4 }}
              style={{
                background:'linear-gradient(135deg,rgba(255,107,53,0.07),rgba(255,159,28,0.05))',
                border:'1px solid rgba(255,107,53,0.18)',
                borderRadius:18, padding:26,
                display:'flex', alignItems:'center', justifyContent:'center',
                position:'relative', overflow:'hidden',
              }}
            >
              <div style={{ position:'absolute', top:'50%', left:'50%', width:100, height:100, borderRadius:'50%', border:'1px solid rgba(255,107,53,0.18)', animation:'pulse-ring 3s ease-out infinite' }}/>
              <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:19, fontWeight:700, color:'#fff', marginBottom:10 }}>Ready to evaluate?</h3>
                <p style={{ fontSize:13, color:'#8891a4', marginBottom:20, lineHeight:1.7 }}>Full quality report in under 3 seconds.</p>
                <Link to="/evaluate" style={{
                  display:'inline-block', padding:'11px 26px', borderRadius:999,
                  background:'linear-gradient(135deg,#ff6b35,#ff9f1c)',
                  color:'#fff', textDecoration:'none',
                  fontSize:13, fontWeight:600,
                  boxShadow:'0 4px 20px rgba(255,107,53,0.38)',
                }}>
                  Start Now →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
