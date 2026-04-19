import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../utils/store';
import { getHistory, deleteHistoryItem, clearHistory as clearHistoryApi } from '../utils/api';
import toast from 'react-hot-toast';

function scoreColor(v) {
  if (v == null) return '#4a5568';
  if (v >= 80) return '#00d4aa';
  if (v >= 60) return '#ff9f1c';
  return '#e53e3e';
}

export default function History() {
  const { history, setHistory, removeFromHistory } = useStore();
  const [loading, setLoading]   = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    setLoading(true);
    getHistory()
      .then(d => setHistory(d.items || []))
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      removeFromHistory(id);
      toast.success('Deleted');
    } catch (e) { toast.error(e.message); }
  };

  const handleClear = async () => {
    if (!confirm('Clear all history?')) return;
    setClearing(true);
    try {
      await clearHistoryApi();
      setHistory([]);
      toast.success('History cleared');
    } catch (e) { toast.error(e.message); }
    finally { setClearing(false); }
  };

  return (
    <div style={{ paddingTop:90, minHeight:'100vh', position:'relative', zIndex:1 }}>
      <div style={{ maxWidth:1160, margin:'0 auto', padding:'40px 32px 80px' }}>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:'#ff6b35', textTransform:'uppercase', marginBottom:10 }}>Session History</div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:'#fff' }}>
              Past <span className="g-text">Evaluations</span>
            </h1>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <span style={{ fontSize:12, color:'#4a5568' }}>{history.length} record{history.length!==1?'s':''}</span>
            {history.length > 0 && (
              <button onClick={handleClear} disabled={clearing} style={{
                padding:'8px 18px', borderRadius:999,
                background:'rgba(229,62,62,0.08)', border:'1px solid rgba(229,62,62,0.2)',
                color:'#e53e3e', fontSize:12, fontWeight:600, cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
              }}>
                {clearing ? 'Clearing…' : 'Clear All'}
              </button>
            )}
          </div>
        </motion.div>

        {loading && (
          <div style={{ textAlign:'center', padding:80, color:'#4a5568' }}>
            <div style={{ width:32, height:32, border:'2px solid rgba(255,107,53,0.2)', borderTopColor:'#ff6b35', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }}/>
            Loading history…
          </div>
        )}

        {!loading && history.length === 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ textAlign:'center', padding:'80px 40px', color:'#4a5568' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
            <p style={{ fontSize:15, marginBottom:24 }}>No evaluations yet.</p>
            <Link to="/evaluate" style={{
              display:'inline-block', padding:'11px 26px', borderRadius:999,
              background:'linear-gradient(135deg,#ff6b35,#ff9f1c)',
              color:'#fff', textDecoration:'none', fontSize:13, fontWeight:600,
            }}>
              Run Your First Evaluation →
            </Link>
          </motion.div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-20 }}
                transition={{ duration:0.35, delay: i * 0.04 }}
                style={{
                  background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:14, padding:'16px 20px',
                  display:'flex', alignItems:'center', gap:16,
                  transition:'border-color 0.2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}
              >
                {/* Score circle */}
                <div style={{
                  width:52, height:52, borderRadius:'50%', flexShrink:0,
                  border:`2px solid ${scoreColor(item.overall)}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:`${scoreColor(item.overall)}11`,
                }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:scoreColor(item.overall) }}>
                    {item.overall != null ? item.overall + '%' : '?'}
                  </span>
                </div>

                {/* Main info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:500, color:'#e8eaf0', marginBottom:3,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {item.prompt}
                  </div>
                  <div style={{ fontSize:12, color:'#8891a4' }}>
                    {item.headline && <span style={{ color:'#c0c8d8' }}>{item.headline} · </span>}
                    {new Date(item.timestamp).toLocaleString()}
                    {item.durationMs && <span style={{ color:'#4a5568' }}> · {(item.durationMs/1000).toFixed(1)}s</span>}
                  </div>
                </div>

                {/* Actions */}
                <button onClick={() => handleDelete(item.id)} style={{
                  width:34, height:34, borderRadius:8, flexShrink:0,
                  background:'transparent', border:'1px solid rgba(255,255,255,0.08)',
                  color:'#4a5568', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:14, transition:'all 0.2s',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#e53e3e';e.currentTarget.style.color='#e53e3e';e.currentTarget.style.background='rgba(229,62,62,0.08)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.08)';e.currentTarget.style.color='#4a5568';e.currentTarget.style.background='transparent'}}
                  title="Delete"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
