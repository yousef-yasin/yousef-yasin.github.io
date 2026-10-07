import { projects, moreProjects } from '../data/projects.js';
import Flagship, { CaseFooter } from './Flagship.jsx';
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

        {projects.map((p, i) => (
          <CaseStudy key={p.id} p={p} index={i + 2} flip={i % 2 === 0} />
        ))}

        {moreProjects.length > 0 && <MoreWork items={moreProjects} />}
      </div>
    </section>
  );
}

function CaseStudy({ p, index, flip }) {
  return (
    <article className={`case ${flip ? 'case-flip' : ''}`} aria-labelledby={`case-${p.id}`}>
      <header className="case-head reveal">
        <span className="case-num" aria-hidden="true">{String(index).padStart(2, '0')}</span>
        <div className="case-meta">
          <span className="mono">{p.category}</span>
        </div>
      </header>

      <div className="case-grid">
        <div className="case-visual reveal">
          <ProjectVisual kind={p.visual} />
        </div>

        <div className="case-copy">
          <h3 id={`case-${p.id}`} className="case-name reveal">{p.name}</h3>
          <p className="case-tagline reveal">{p.tagline}</p>
          <dl className="case-story reveal">
            <div><dt>Problem</dt><dd>{p.problem}</dd></div>
            <div><dt>Solution</dt><dd>{p.solution}</dd></div>
          </dl>
        </div>
      </div>

      <CaseFooter role={p.role} tech={p.tech} links={p.links} />
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
