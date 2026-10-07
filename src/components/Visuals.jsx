import { useRef } from 'react';

// Pointer-driven 3D tilt. Children marked with `data-depth` float at
// different Z depths, so the visual reads as layered space, not a flat image.
export function Tilt({ children, className = '', max = 8 }) {
  const ref = useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMove = (e) => {
    if (reduce) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty('--ry', `${x * max}deg`);
    ref.current.style.setProperty('--rx', `${-y * max}deg`);
    ref.current.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    ref.current.style.setProperty('--ry', '0deg');
    ref.current.style.setProperty('--rx', '0deg');
  };

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="tilt-inner">{children}</div>
    </div>
  );
}

const mono = { fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--text-3)', letterSpacing: '0.04em' };

// Autonomous Underwater Robot — sonar sweep, detections, navigation path
function Sonar() {
  return (
    <svg viewBox="0 0 640 440" className="vis-svg" role="img" aria-label="Illustration: underwater robot detecting objects with computer vision">
      <defs>
        <radialGradient id="sonarFade" cx="50%" cy="100%" r="90%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
          <stop offset="70%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sweep" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <path d="M40 420 A280 280 0 0 1 600 420 Z" fill="url(#sonarFade)" />
      {[90, 160, 230, 300].map((r) => (
        <path key={r} d={`M${320 - r} 420 A${r} ${r} 0 0 1 ${320 + r} 420`} fill="none" stroke="var(--line-2)" strokeDasharray="2 6" />
      ))}
      <g className="sweep">
        <path d="M320 420 L320 110 A310 310 0 0 1 430 130 Z" fill="url(#sweep)" />
      </g>
      <path d="M120 360 C 200 300, 260 330, 320 260 S 460 170, 540 120" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="5 7" />
      <circle cx="540" cy="120" r="4" fill="var(--accent)" />
      {[
        [182, 190, 70, 54, 'object'],
        [408, 232, 92, 70, 'target'],
      ].map(([x, y, w, h, label]) => (
        <g key={label}>
          <path d={`M${x} ${y + 14}V${y}h14 M${x + w - 14} ${y}h14v14 M${x + w} ${y + h - 14}v14h-14 M${x + 14} ${y + h}H${x}v-14`} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) / 4} fill="rgba(20,20,19,0.05)" stroke="var(--line-2)" />
          <text x={x} y={y - 8} style={{ ...mono, fill: 'var(--accent)' }}>{label}</text>
        </g>
      ))}
      <text x="40" y="40" style={mono}>vision.detect()</text>
      <text x="40" y="58" style={mono}>nav.mode = autonomous</text>
    </svg>
  );
}

// Arab Cafe Management System — order flow into an admin dashboard
function Orders() {
  const flow = ['M110 120 C 200 120, 220 220, 320 220', 'M110 220 C 200 220, 220 220, 320 220', 'M110 320 C 200 320, 220 220, 320 220', 'M320 220 C 400 220, 420 150, 520 150', 'M320 220 C 400 220, 420 290, 520 290'];
  return (
    <svg viewBox="0 0 640 440" className="vis-svg" role="img" aria-label="Illustration: cafeteria orders flowing into an admin dashboard">
      {flow.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="var(--line-2)" />
        </g>
      ))}
      {[120, 220, 320].map((y, i) => (
        <g key={y}>
          <rect x="40" y={y - 18} width="70" height="36" rx="18" fill="var(--bg)" stroke="var(--line-2)" />
          <text x="75" y={y + 4} textAnchor="middle" style={mono}>order {i + 1}</text>
        </g>
      ))}
      <circle cx="320" cy="220" r="42" fill="var(--bg)" stroke="var(--accent)" />
      <text x="320" y="216" textAnchor="middle" style={{ ...mono, fill: 'var(--text)' }}>Flask</text>
      <text x="320" y="232" textAnchor="middle" style={mono}>API</text>
      <g>
        <text x="520" y="120" style={mono}>admin</text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1="520" x2="610" y1={140 + i * 12} y2={140 + i * 12} stroke="var(--line-2)" />
            <line x1="520" x2={540 + ((i * 23) % 60)} y1={140 + i * 12} y2={140 + i * 12} stroke="var(--accent)" />
          </g>
        ))}
        <text x="520" y="280" style={mono}>menu</text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={520 + i * 32} y="292" width="24" height="24" rx="6" fill="none" stroke="var(--line-2)" />
        ))}
      </g>
      <text x="40" y="40" style={mono}>orders → kitchen → ready</text>
    </svg>
  );
}

// TEDx AAU Website — the same layout across desktop, tablet and phone
function Devices() {
  const Layout = ({ x, y, w, h }) => (
    <g>
      <rect x={x + 10} y={y + 12} width={w * 0.35} height="6" rx="3" fill="var(--accent)" opacity="0.8" />
      <rect x={x + 10} y={y + 30} width={w - 20} height={h * 0.32} rx="4" fill="rgba(20,20,19,0.05)" />
      {Array.from({ length: w > 200 ? 3 : 1 }, (_, i) => {
        const cols = w > 200 ? 3 : 1;
        const cw = (w - 20 - (cols - 1) * 8) / cols;
        return <rect key={i} x={x + 10 + i * (cw + 8)} y={y + 38 + h * 0.32} width={cw} height={h * 0.28} rx="4" fill="none" stroke="var(--line-2)" />;
      })}
    </g>
  );
  return (
    <svg viewBox="0 0 640 440" className="vis-svg" role="img" aria-label="Illustration: one responsive website shown on desktop, tablet and phone">
      <g>
        <rect x="40" y="70" width="400" height="260" rx="12" fill="var(--bg)" stroke="var(--line-2)" />
        <circle cx="58" cy="86" r="3" fill="var(--line-2)" /><circle cx="70" cy="86" r="3" fill="var(--line-2)" />
        <Layout x={40} y={90} w={400} h={240} />
      </g>
      <g>
        <rect x="380" y="150" width="170" height="230" rx="14" fill="var(--bg)" stroke="var(--line-2)" />
        <Layout x={385} y={160} w={160} h={210} />
      </g>
      <g>
        <rect x="520" y="230" width="86" height="170" rx="14" fill="var(--bg)" stroke="var(--accent)" />
        <Layout x={524} y={240} w={78} h={150} />
      </g>
      <text x="40" y="40" style={mono}>@media responsive · Bootstrap</text>
    </svg>
  );
}

const VISUALS = { sonar: Sonar, orders: Orders, devices: Devices };

export function ProjectVisual({ kind }) {
  const V = VISUALS[kind];
  return V ? <V /> : null;
}
