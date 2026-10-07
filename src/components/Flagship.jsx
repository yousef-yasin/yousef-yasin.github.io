import { flagship as p } from '../data/projects.js';
import { Tilt } from './Visuals.jsx';
import { ArrowUpRight } from './Icons.jsx';

// QOYN — the flagship case study, presented editorially rather than in a card.
export default function Flagship() {
  return (
    <article className="flagship" aria-labelledby="flagship-title">
      <header className="case-head reveal">
        <span className="case-num" aria-hidden="true">01</span>
        <div className="case-meta">
          <span className="badge">Flagship</span>
          <span className="mono">{p.title}</span>
        </div>
      </header>

      <h3 id="flagship-title" className="flagship-name reveal">
        {p.name}
        <span className="flagship-title">{p.title}</span>
      </h3>

      <div className="flagship-stage reveal">
        {p.image && (
          <Tilt className="shot-tilt" max={4}>
            <figure className="shot">
              <div className="shot-bar" aria-hidden="true"><i /><i /><i /></div>
              <img src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} loading="lazy" decoding="async" />
            </figure>
          </Tilt>
        )}
        <p className="flagship-tagline">{p.tagline}</p>
      </div>

      <div className="story reveal">
        <div>
          <h4>Problem</h4>
          <p>{p.problem}</p>
        </div>
        <div>
          <h4>Solution</h4>
          <p>{p.solution}</p>
        </div>
      </div>

      <div className="engine-row">
        <QpeRing />
        <div className="engine-copy reveal">
          <p className="eyebrow"><span className="mono">{p.engine.short}</span> {p.engine.name}</p>
          <p className="engine-lead">The central intelligence layer.</p>
          <p>{p.engine.text.replace('The central intelligence layer. ', '')}</p>
        </div>
      </div>

      <div className="caps reveal" aria-label="Platform capabilities">
        {p.capabilities.map((g) => (
          <div key={g.group} className="cap">
            <span className="cap-group mono">{g.group}</span>
            <ul>{g.items.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="engineering reveal">
        <h4>Engineering</h4>
        <ol className="numbered">
          {p.highlights.map((h, i) => (
            <li key={h}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <p>{h}</p>
            </li>
          ))}
        </ol>
      </div>

      <CaseFooter role={p.role} tech={p.tech} links={p.links} />
    </article>
  );
}

function QpeRing() {
  const n = p.journey.length;
  return (
    <div className="ring-wrap reveal">
      <div className="ring">
        <svg className="ring-svg" viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="150" className="ring-track" />
          <circle cx="200" cy="200" r="150" className="ring-flow" />
          {p.journey.map((_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return <line key={i} x1="200" y1="200" x2={200 + Math.cos(a) * 150} y2={200 + Math.sin(a) * 150} className="ring-spoke" />;
          })}
        </svg>
        <div className="ring-core">
          <span className="mono">{p.engine.short}</span>
          <small>Potential Engine</small>
        </div>
        <ol className="ring-nodes" aria-label="QOYN journey">
          {p.journey.map((j, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const pos = { '--i': i, '--x': `${50 + Math.cos(a) * 37.5}%`, '--y': `${50 + Math.sin(a) * 37.5}%` };
            return (
              <li key={j.step} style={pos}>
                <span className="node-dot mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="node-label">{j.step}</span>
                <span className="node-text">{j.text}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function CaseFooter({ role, tech, links = {} }) {
  const href = links.demo || links.github;
  return (
    <footer className="case-foot reveal">
      {role && (
        <div>
          <span className="cf-label mono">Role</span>
          <p>{role}</p>
        </div>
      )}
      <div>
        <span className="cf-label mono">Stack</span>
        <p className="mono cf-stack">{tech.join(' / ')}</p>
      </div>
      {href && (
        <a href={href} target="_blank" rel="noreferrer" className="explore">
          <span>Explore Project</span>
          <ArrowUpRight width={20} height={20} />
        </a>
      )}
    </footer>
  );
}
