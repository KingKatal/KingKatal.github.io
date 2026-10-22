# Gomezgani Chirwa — Portfolio

Personal portfolio and professional profile of **Gomezgani Chirwa** — IT Officer, GIS Specialist, Data Analyst, and Founder of **KataTech Solutions**, based in Malawi.

**Live site:** [https://kingkatal.github.io](https://kingkatal.github.io)

---

## About

A hand-built, dependency-free single-page portfolio designed to give recruiters and clients a clear, fast overview of my work: systems administration, geospatial analysis, data reporting, and full-stack web development.

## Sections

| Section | Purpose |
| --- | --- |
| Hero | Introduction, quick actions, and availability status |
| About | Background, focus areas, and key statistics |
| Skills | Technical toolkit grouped by discipline |
| Projects | Featured spotlight carousel plus GitHub-backed project cards |
| Services | What I offer through KataTech Solutions |
| Experience | Professional and education timeline |
| Gallery | Visual work samples with lightbox viewing |
| Contact | Direct email, phone/WhatsApp, and GitHub links |

## Highlights

- **No build step, no frameworks** — plain HTML, CSS, and vanilla JavaScript
- **Dark and light themes** with a persisted preference
- **Expressive motion** — scroll progress, parallax hero, 3D tilt cards, staggered reveals, and a featured spotlight carousel
- **Accessible by default** — semantic landmarks, keyboard-navigable lightbox and mobile menu, visible focus states, and full `prefers-reduced-motion` support
- **Icon system** — inline SVG sprite, no icon font or emoji
- **Live project data** — public repositories are pulled from the GitHub API at runtime

## Tech stack

- HTML5 (semantic markup, Open Graph metadata)
- CSS3 (custom properties, Grid, Flexbox, container-relative typography)
- Vanilla JavaScript (ES6+, no dependencies)
- GitHub REST API for dynamic project loading

## Project structure

```
KingKatal.github.io/
├── index.html          # Single-page site markup and SVG icon sprite
├── css/
│   ├── main.css        # Design tokens, themes, layout, components
│   └── animations.css  # Motion, section styling, and keyframes
├── js/
│   ├── main.js         # Theme, navigation, reveals, carousel, lightbox
│   └── github.js       # GitHub repository loader and project cards
├── assets/             # CV, profile photo, and media
├── .gitignore
├── .nojekyll           # Serve files as-is on GitHub Pages
└── README.md
```

## Run locally

No installation or tooling required. Either open `index.html` directly, or serve the folder over HTTP (recommended so the GitHub API requests behave consistently):

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

The site is deployed with **GitHub Pages** from the `main` branch root — no build step and no configuration needed.

```bash
git add .
git commit -m "Your change"
git push
```

Changes go live within about a minute.

## Contact

- **Email:** [chirwagomez@gmail.com](mailto:chirwagomez@gmail.com)
- **Phone / WhatsApp:** [+265 880 725 061](tel:+265880725061)
- **GitHub:** [github.com/KingKatal](https://github.com/KingKatal)
- **Company:** KataTech Solutions

---

© Gomezgani Chirwa. All rights reserved.
