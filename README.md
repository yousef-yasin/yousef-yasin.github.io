# Yousef Samer Yasin — Portfolio

Personal portfolio of **Yousef Samer Yasin**, AI & ML engineer and Data Science & Artificial Intelligence student at Amman Arab University (expected 2027).

Flagship project: **QOYN — AI Career & Learning Platform**.

**Live:** https://yousef-yasin.github.io

Built with **React + Vite** and plain CSS. No backend, no UI framework. Runtime dependencies: `react` and `react-dom`.

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
  components/           Hero, HeroVisual (layered SVG), Flagship (QOYN), Projects, Sections, Layout, Visuals (project art + tilt)
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
- Respects `prefers-reduced-motion`: all animations stop
- The hero visual is lightweight SVG animated with GPU-friendly transforms only; pointer parallax is throttled to animation frames and disabled on touch devices

To add a project screenshot, put the image in `public/projects/` and set `image: { src, alt, width, height }` on the project in `src/data/projects.js`.
