import { useEffect, useState } from 'react';
import { profile } from '../data/profile.js';
import { GitHub, LinkedIn, Mail } from './Icons.jsx';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#achievements', label: 'Awards' },
  { href: '#contact', label: 'Contact' },
];

export function SectionHeader({ index, eyebrow, title, intro }) {
  return (
    <header className="section-head reveal">
      <p className="eyebrow">
        <span className="mono">{index}</span> {eyebrow}
      </p>
      <h2>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </header>
  );
}

export function SocialLinks({ withEmail = false }) {
  const { github, linkedin } = profile.links;
  return (
    <div className="socials">
      {github && (
        <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
          <GitHub />
        </a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
          <LinkedIn />
        </a>
      )}
      {withEmail && (
        <a href={`mailto:${profile.email}`} aria-label="Email">
          <Mail />
        </a>
      )}
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} aria-label="Main">
      <div className="container nav-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">{profile.initials}</span>
          <span>{profile.shortName}</span>
        </a>
        <ul className="nav-links">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
            </li>
          ))}
        </ul>
        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <SocialLinks withEmail />
        <a href="#top" className="to-top">Back to top ↑</a>
      </div>
    </footer>
  );
}
