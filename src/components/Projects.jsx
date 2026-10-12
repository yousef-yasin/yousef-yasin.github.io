import { projects, moreProjects } from '../data/projects.js';
import Flagship from './Flagship.jsx';
import { ProjectVisual } from './Visuals.jsx';
import { ArrowUpRight } from './Icons.jsx';

export default function Projects() {
  const total = projects.length + 1;
  return (
    <section className="section work" id="work">
      <div className="container">
        <header className="work-head reveal">
          <div>
            <p className="eyebrow"><span className="mono">02</span> Selected work</p>
            <h2 className="display">
              Case studies <sup className="mono">({String(total).padStart(2, '0')})</sup>
            </h2>
          </div>
          <p className="work-intro">
            From an AI career platform to underwater robotics — systems taken from idea to something that works.
          </p>
        </header>

        <Flagship />

        <div className="cards">
          {projects.map((p, i) => (
            <WorkCard key={p.id} p={p} index={i + 2} />
          ))}
        </div>

        {moreProjects.length > 0 && <MoreWork items={moreProjects} />}
      </div>
    </section>
  );
}

function WorkCard({ p, index }) {
  const href = p.links.demo || p.links.github;
  return (
    <article className="card reveal" style={{ '--d': `${(index - 2) * 80}ms` }} aria-labelledby={`case-${p.id}`}>
      <div className="card-visual">
        <ProjectVisual kind={p.visual} />
      </div>
      <p className="card-meta mono">
        <span>{String(index).padStart(2, '0')}</span>
        <span>{p.category}</span>
      </p>
      <h3 id={`case-${p.id}`} className="card-name">{p.name}</h3>
      <p className="card-text">{p.tagline} {p.solution}</p>
      <div className="card-foot">
        <span className="mono">{p.tech.slice(0, 3).join(' / ')}</span>
        {href && (
          <a href={href} target="_blank" rel="noreferrer" aria-label={`${p.name} on GitHub`}>
            <ArrowUpRight width={18} height={18} />
          </a>
        )}
      </div>
    </article>
  );
}

function MoreWork({ items }) {
  return (
    <div className="more">
      <header className="more-head reveal">
        <p className="eyebrow">Also on GitHub</p>
        <a href="https://github.com/yousef-yasin" target="_blank" rel="noreferrer" className="link">
          All repositories <ArrowUpRight width={15} height={15} />
        </a>
      </header>
      <ol className="index">
        {items.map((m, i) => (
          <li key={m.name} className="reveal" style={{ '--d': `${i * 40}ms` }}>
            <a href={m.link} target="_blank" rel="noreferrer">
              <span className="index-num mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="index-name">{m.name}</span>
              <span className="index-text">{m.text}</span>
              <span className="index-tech mono">{m.tech.join(' / ')}</span>
              <ArrowUpRight className="index-arrow" width={22} height={22} />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
