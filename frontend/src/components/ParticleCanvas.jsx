import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], raf;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    const COLORS = ['255,107,53','255,159,28','0,212,170','124,106,247'];

    class Particle {
      constructor(init = false) { this.reset(init); }
      reset(init = false) {
        this.x      = Math.random() * W;
        this.y      = init ? Math.random() * H : H + 10;
        this.size   = Math.random() * 1.4 + 0.3;
        this.vx     = (Math.random() - 0.5) * 0.35;
        this.vy     = -(Math.random() * 0.55 + 0.15);
        this.alpha  = Math.random() * 0.45 + 0.08;
        this.life   = 0;
        this.max    = Math.random() * 220 + 80;
        this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.life++;
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < 90) { const f = (90 - d) / 90; this.x += (dx / d) * f * 1.8; this.y += (dy / d) * f * 1.8; }
        if (this.life > this.max || this.y < -20) this.reset();
      }
      draw() {
        const t = this.life / this.max;
        const a = this.alpha * (1 - t * t);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${a})`;
        ctx.fill();
      }
    }

    function drawLines() {
      const D = 75;
      for (let i = 0; i < particles.length; i++)
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < D) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,107,53,${(1 - d / D) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
    }

    function init() {
      resize();
      const n = Math.min(Math.floor(W * H / 10000), 110);
      particles = Array.from({ length: n }, () => new Particle(true));
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(loop);
    }

    const onMove  = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onResize = () => { resize(); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    init();
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, opacity:0.55 }}
    />
  );
}
