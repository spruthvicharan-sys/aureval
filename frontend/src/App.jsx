import { Routes, Route } from 'react-router-dom';
import ParticleCanvas from './components/ParticleCanvas';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Evaluate from './pages/Evaluate';
import History from './pages/History';

export default function App() {
  return (
    <>
      <ParticleCanvas />
      <Cursor />
      <Navbar />

      <main>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/evaluate" element={<Evaluate />} />
          <Route path="/history"  element={<History />} />
          <Route path="*"         element={
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              minHeight:'100vh', gap:16, color:'#4a5568', position:'relative', zIndex:1 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:64, fontWeight:800, color:'rgba(255,255,255,0.06)' }}>404</div>
              <p style={{ fontSize:15 }}>Page not found</p>
              <a href="/" style={{ color:'#ff6b35', fontSize:13 }}>← Go Home</a>
            </div>
          } />
        </Routes>
      </main>

      <footer style={{
        position:'relative', zIndex:1,
        borderTop:'1px solid rgba(255,255,255,0.06)',
        background:'rgba(7,9,16,0.95)',
      }}>
        <div style={{ maxWidth:1160, margin:'0 auto', padding:'32px', display:'flex', flexDirection:'column', alignItems:'center', gap:10, textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:26, height:26, borderRadius:7, background:'linear-gradient(135deg,#ff6b35,#ff9f1c)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="7" stroke="#fff" strokeWidth="1.8"/>
                <circle cx="12" cy="12" r="3" fill="#fff"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, letterSpacing:3, color:'#fff' }}>AUREVAL</span>
          </div>
          <p style={{ fontSize:12, color:'#4a5568' }}>AI Response Intelligence</p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.08)' }}>© 2025 Aureval</p>
        </div>
      </footer>
    </>
  );
}
