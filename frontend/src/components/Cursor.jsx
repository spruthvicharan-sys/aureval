import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;

    const onMove = e => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    };

    let raf;
    function animate() {
      const p = pos.current;
      p.rx += (p.mx - p.rx) * 0.13;
      p.ry += (p.my - p.ry) * 0.13;
      ring.style.left = p.rx + 'px';
      ring.style.top  = p.ry + 'px';
      raf = requestAnimationFrame(animate);
    }

    const expand   = () => ring.classList.add('expanded');
    const contract = () => ring.classList.remove('expanded');
    const targets  = document.querySelectorAll('a,button,[data-hover]');
    targets.forEach(el => {
      el.addEventListener('mouseenter', expand);
      el.addEventListener('mouseleave', contract);
    });

    window.addEventListener('mousemove', onMove);
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      targets.forEach(el => {
        el.removeEventListener('mouseenter', expand);
        el.removeEventListener('mouseleave', contract);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
