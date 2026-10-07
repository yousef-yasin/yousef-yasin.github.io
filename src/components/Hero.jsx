import { profile } from '../data/profile.js';
import Scene3D from './Scene3D.jsx';
import { SocialLinks } from './Layout.jsx';
import { ArrowRight } from './Icons.jsx';

export default function Hero() {
  const [first, ...rest] = profile.name.split(' ');
  return (
    <section className="hero" id="top">
      <Scene3D />
      <div className="hero-veil" aria-hidden="true" />
      <div className="container hero-inner">
        <p className="hero-kicker mono fade-up" style={{ '--d': '0ms' }}>{profile.location}</p>
        <h1 className="hero-name">
          <span className="line"><span className="fade-up" style={{ '--d': '80ms' }}>{first}</span></span>
          <span className="line"><span className="fade-up" style={{ '--d': '160ms' }}>{rest.join(' ')}</span></span>
        </h1>
        <p className="hero-role fade-up" style={{ '--d': '260ms' }}>{profile.role}</p>
        <div className="hero-cta fade-up" style={{ '--d': '360ms' }}>
          <a href="#work" className="btn btn-primary">
            View Projects <ArrowRight />
          </a>
          <a href="#contact" className="btn btn-ghost">Contact Me</a>
          <SocialLinks />
        </div>
      </div>
      <a href="#about" className="scroll-line fade-up" style={{ '--d': '600ms' }} aria-label="Scroll to About">
        <span />
      </a>
    </section>
  );
}
