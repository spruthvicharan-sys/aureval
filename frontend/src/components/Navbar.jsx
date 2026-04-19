import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4,0,0.2,1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '12px 40px' : '20px 40px',
        background: scrolled ? 'rgba(7,9,16,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{
            width:30, height:30, borderRadius:8,
            background: 'linear-gradient(135deg,#ff6b35,#ff9f1c)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation: 'logo-pulse 3s ease-in-out infinite',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="7" stroke="#fff" strokeWidth="1.8"/>
              <circle cx="12" cy="12" r="3" fill="#fff"/>
            </svg>
          </div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, letterSpacing:3, color:'#fff' }}>
            AUREVAL
          </span>
        </Link>

        <div style={{ display:'flex', gap:28 }}>
          {[['/', 'Home'], ['/evaluate', 'Evaluate'], ['/history', 'History']].map(([to, label]) => (
            <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
              color: isActive ? '#fff' : '#8891a4',
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
              letterSpacing: 0.4, transition: 'color 0.2s',
              borderBottom: isActive ? '1px solid #ff6b35' : '1px solid transparent',
              paddingBottom: 2,
            })}>
              {label}
            </NavLink>
          ))}
        </div>

        <Link to="/evaluate" style={{
          padding:'9px 20px', borderRadius:999,
          background:'linear-gradient(135deg,#ff6b35,#ff9f1c)',
          color:'#fff', textDecoration:'none',
          fontSize:13, fontWeight:600, letterSpacing:0.4,
          boxShadow:'0 4px 18px rgba(255,107,53,0.32)',
          transition:'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(255,107,53,0.5)'}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 18px rgba(255,107,53,0.32)'}}
        >
          Try Now →
        </Link>
      </div>
    </motion.nav>
  );
}
