import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  dead: boolean;
}

interface ParticleTextEffectProps {
  text?: string;
  fontSize?: number;
  colors?: string[];
  particleDensity?: number;
  className?: string;
}

export function ParticleTextEffect({
  text = 'Hello',
  fontSize = 160,
  colors = ['#c026d3', '#7c3aed', '#2563eb', '#e879f9', '#a78bfa'],
  particleDensity = 4,
  className = '',
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999, right: false });

  const getColor = useCallback(() => colors[Math.floor(Math.random() * colors.length)], [colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Draw text offscreen to sample pixel positions
      const offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      const octx = offscreen.getContext('2d')!;

      octx.clearRect(0, 0, w, h);
      octx.fillStyle = '#fff';
      octx.font = `900 ${fontSize}px Inter, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText(text, w / 2, h / 2);

      const imageData = octx.getImageData(0, 0, w, h).data;
      const particles: Particle[] = [];

      for (let y = 0; y < h; y += particleDensity) {
        for (let x = 0; x < w; x += particleDensity) {
          const idx = (y * w + x) * 4;
          if (imageData[idx + 3] > 128) {
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              baseX: x,
              baseY: y,
              vx: 0,
              vy: 0,
              size: Math.random() * 1.5 + 1,
              color: getColor(),
              alpha: Math.random() * 0.5 + 0.5,
              life: 1,
              dead: false,
            });
          }
        }
      }

      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const repelRadius = 80;
      const repelStrength = 6;
      const destroyRadius = 60;

      particlesRef.current = particlesRef.current.filter(p => !p.dead);

      for (const p of particlesRef.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouseRef.current.right && dist < destroyRadius) {
          p.dead = true;
          continue;
        }

        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          p.vx += (dx / dist) * force * repelStrength;
          p.vy += (dy / dist) * force * repelStrength;
        }

        // Spring back
        const tx = p.baseX - p.x;
        const ty = p.baseY - p.y;
        p.vx += tx * 0.08;
        p.vy += ty * 0.08;

        // Damping
        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;

        // Color shift over time
        const hue = (Date.now() * 0.05 + p.baseX * 0.3 + p.baseY * 0.2) % 360;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsl(${hue}, 80%, 70%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      mouseRef.current.right = false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.right = true;
      setTimeout(() => { mouseRef.current.right = false; }, 100);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [text, fontSize, particleDensity, getColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
