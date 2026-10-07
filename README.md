# Yousef Samer Yasin — Portfolio

Personal portfolio of **Yousef Samer Yasin**, AI & ML engineer and Data Science & Artificial Intelligence student at Amman Arab University (expected 2027).

Flagship project: **QOYN — AI Career & Learning Platform**.

**Live:** https://yousef-yasin.github.io

Built with **React + Vite**, plain CSS and **Three.js / React Three Fiber** for the 3D scenes. No backend, no UI framework. Runtime dependencies: `react`, `react-dom`, `three`, `@react-three/fiber`.

## Run locally

```bash
npm install      # first time only
npm run dev      # opens http://localhost:5173
```

Production build:

```bash
npm run build    # outputs to dist/
npm run preview  # serves the built site locally
```

## Editing content

All content lives in `src/data/`. The components only render it.

| File | What it controls |
|---|---|
| `src/data/profile.js` | Name, headline, focus pillars, about text, languages, email, GitHub / LinkedIn |
| `src/data/projects.js` | QOYN flagship (`flagship`), large project cards (`projects`), compact GitHub cards (`moreProjects`) |
| `src/data/content.js` | Skills, experience, achievements, education, certifications |

Case studies render only the fields they have. Add `links: { github, demo }`, `role`, `highlights` or `image` to a project and its section shows them automatically. `visual` picks one of the generated illustrations in `src/components/Visuals.jsx`.

## Structure

```
src/
  data/                 content (edit these)
  components/           Hero, Flagship (QOYN), Projects, Sections, Layout, Visuals (project art + 3D tilt)
  components/three/     Scene.jsx: the real-time 3D "neural core" (lazy-loaded)
  styles/global.css     design tokens + all styles
public/projects/        project screenshots
.github/workflows/deploy.yml   GitHub Pages deployment
```

Design tokens (colours, fonts, radii) are CSS variables at the top of `src/styles/global.css`. Change `--accent` / `--accent-rgb` to re-theme the whole site.

## Deployment

The site deploys to GitHub Pages automatically: every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to https://yousef-yasin.github.io.

`vite.config.js` uses relative paths (`base: './'`), so the same build also works on Vercel or Netlify (build command `npm run build`, output directory `dist`).

## Accessibility & performance

- Semantic sections, skip link, visible focus states, labelled icon links
- Respects `prefers-reduced-motion`: animations stop and the 3D scene renders a single still frame
- three.js loads in a separate chunk after first paint, only where WebGL is available; the contact-section scene loads only when scrolled near
- 3D scenes stop rendering when off-screen

To add a project screenshot, put the image in `public/projects/` and set `image: { src, alt, width, height }` on the project in `src/data/projects.js`.
