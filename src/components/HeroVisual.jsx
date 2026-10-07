import { useEffect, useRef } from 'react';

// Isometric stack of layers: data → model → system → product.
// Pure SVG; motion is limited to compositor-friendly transforms.
const LAYERS = [
  { label: 'product', y: 0 },
  { label: 'system', y: 74 },
  { label: 'model', y: 148 },
  { label: 'data', y: 222 },
];

const CX = 300;
const W = 380;
const H = W * 0.58;
const TOP = 150;

function plane(y) {
  const cy = TOP + y;
  return `M${CX} ${cy - H / 2} L${CX + W / 2} ${cy} L${CX} ${cy + H / 2} L${CX - W / 2} ${cy} Z`;
}

function isoGrid(y, n = 6) {
  const cy = TOP + y;
  const lines = [];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    // lines parallel to each pair of edges
    lines.push(`M${CX - W / 2 + (W / 2) * t} ${cy - (H / 2) * t} L${CX + (W / 2) * t} ${cy + H / 2 - (H / 2) * t}`);
    lines.push(`M${CX + W / 2 - (W / 2) * t} ${cy - (H / 2) * t} L${CX - (W / 2) * t} ${cy + H / 2 - (H / 2) * t}`);
  }
  return lines.join(' ');
}

// Points on the top plane (iso coordinates u, v in 0..1)
const NODES = [
  [0.3, 0.35], [0.55, 0.25], [0.7, 0.55], [0.45, 0.6], [0.25, 0.7],
];
function iso(u, v, y) {
  const cy = TOP + y;
  return [CX + (u - v) * (W / 2), cy - H / 2 + (u + v) * (H / 2)];
}

export default function HeroVisual() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (e) => {
      x = e.clientX / window.innerWidth - 0.5;
      y = e.clientY / window.innerHeight - 0.5;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          el.style.setProperty('--px', x.toFixed(3));
          el.style.setProperty('--py', y.toFixed(3));
          frame = 0;
        });
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const top = LAYERS[0].y;
  const nodes = NODES.map(([u, v]) => iso(u, v, top));

  return (
    <div ref={ref} className="hero-visual" aria-hidden="true">
      {LAYERS.slice().reverse().map((l, i) => {
        const depth = LAYERS.length - 1 - i;
        const isTop = depth === 0;
        return (
          <div key={l.label} className={`hv-layer ${isTop ? 'is-top' : ''}`} style={{ '--depth': LAYERS.length - depth, '--i': depth }}>
            <svg viewBox="0 0 600 600">
              <path d={plane(l.y)} className="hv-plane" />
              {isTop && <path d={isoGrid(l.y)} className="hv-grid" />}
              <text x={CX + W / 2 + 18} y={TOP + l.y + 4} className="hv-label">{l.label}</text>
              {isTop && (
                <>
                  <polyline points={nodes.map((p) => p.join(',')).join(' ')} className="hv-path" />
                  {nodes.map(([nx, ny], k) => (
                    <circle key={k} cx={nx} cy={ny} r={k === 2 ? 5 : 3.2} className={k === 2 ? 'hv-node is-key' : 'hv-node'} />
                  ))}
                </>
              )}
            </svg>
          </div>
        );
      })}
      <svg viewBox="0 0 600 600" className="hv-links">
        {[[-1, 0], [1, 0], [0, 1]].map(([dx, dy], k) => {
          const x = CX + dx * (W / 2);
          const y1 = TOP + dy * (H / 2);
          return <line key={k} x1={x} x2={x} y1={y1} y2={y1 + LAYERS[3].y} />;
        })}
      </svg>
    </div>
  );
}
