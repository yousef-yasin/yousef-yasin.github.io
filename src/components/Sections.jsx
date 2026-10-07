import { profile } from '../data/profile.js';
import { skills, experience, achievements, education, certifications } from '../data/content.js';
import { SectionHeader } from './Layout.jsx';
import { ArrowUpRight } from './Icons.jsx';

export function About() {
  const [lead, ...rest] = profile.about;
  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <p className="eyebrow reveal"><span className="mono">01</span> About</p>
        <p className="statement reveal">{lead}</p>
        <div className="about-text">
          {rest.map((p, i) => (
            <p key={i} className="reveal" style={{ '--d': `${i * 60}ms` }}>{p}</p>
          ))}
        </div>
        <dl className="facts reveal">
          {profile.focus.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.text}</dd>
            </div>
          ))}
          <div>
            <dt>Languages</dt>
            <dd>{profile.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="container skills-grid">
        <SectionHeader index="03" eyebrow="Capabilities" title="The toolkit behind the work." />
        <ol className="skill-rows">
          {skills.map((s, i) => (
            <li key={s.group} className={`reveal ${i === 0 ? 'is-lead' : ''}`} style={{ '--d': `${i * 50}ms` }}>
              <span className="skill-label">
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                {s.group}
              </span>
              <ul className="skill-items">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Experience and competition results side by side: one dense, balanced section.
export function Record() {
  const firsts = achievements.filter((a) => a.place === '1st').length;
  return (
    <section className="section record" id="experience">
      <div className="container record-grid">
        <SectionHeader index="04" eyebrow="Experience & achievements" title="Applied in industry. Tested in competition." />
        <div className="record-exp">
          <p className="col-title"><span className="eyebrow">Experience</span><span className="mono muted">{experience.length} roles</span></p>
          <ol className="timeline">
            {experience.map((j, i) => (
              <li key={j.role} className="reveal" style={{ '--d': `${i * 50}ms` }}>
                <span className="tl-period mono">{j.period}</span>
                <div>
                  <h3>{j.role}</h3>
                  <p className="tl-org">{j.org}</p>
                  <ul className="tl-points">{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="record-ach" id="achievements">
          <p className="col-title"><span className="eyebrow">Achievements</span><span className="mono muted">{firsts}× 1st place</span></p>
          <ol className="podium">
            {achievements.map((a, i) => (
              <li key={a.title} className={`reveal ${a.place === '1st' ? 'is-first' : ''}`} style={{ '--d': `${i * 50}ms` }}>
                <span className="podium-place">
                  {a.place.replace(/\D/g, '')}<sup>{a.place.replace(/\d/g, '')}</sup>
                </span>
                <span className="podium-title">{a.title}</span>
                {a.detail && <span className="podium-detail">{a.detail}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="edu" id="education">
      <div className="container edu-grid">
        <div className="edu-main reveal">
          <p className="eyebrow"><span className="mono">05</span> Education</p>
          <p className="edu-period mono">{education.period}</p>
          <h3 className="edu-degree">{education.degree}</h3>
          <p className="edu-school">{education.school} · {education.location}</p>
        </div>
        <div className="edu-certs reveal">
          <p className="eyebrow">Certifications & courses</p>
          <ul className="certs">
            {certifications.map((c) => (
              <li key={c.title}>
                {c.title}
                {c.issuer && <span className="cert-issuer">{c.issuer}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { github, linkedin } = profile.links;
  const rows = [
    linkedin && { label: 'LinkedIn', href: linkedin },
    github && { label: 'GitHub', href: github },
  ].filter(Boolean);

  return (
    <section className="section contact" id="contact">
      <div className="container contact-grid">
        <p className="eyebrow reveal"><span className="mono">06</span> Contact</p>
        <h2 className="contact-title reveal">
          Let’s build<br />something <em>real.</em>
        </h2>
        <div className="contact-side reveal">
          <p className="contact-intro">
            Open to AI/ML engineering roles, internships, research collaborations and competition teams.
          </p>
        </div>
        <a className="contact-email reveal" href={`mailto:${profile.email}`}>
          {profile.email} <ArrowUpRight width={28} height={28} />
        </a>
        <ul className="contact-links reveal">
          {rows.map((r) => (
            <li key={r.label}>
              <a href={r.href} target="_blank" rel="noreferrer">
                {r.label} <ArrowUpRight width={14} height={14} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
