import { Nav, Footer } from './components/Layout.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import { About, Skills, Record, Education, Contact } from './components/Sections.jsx';
import { useReveal } from './components/useReveal.js';

export default function App() {
  useReveal();
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Record />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
