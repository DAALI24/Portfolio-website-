# DilshadAli Ansari — Portfolio

A hand-built, single-page portfolio for **DilshadAli Ansari**, software engineer
and data analyst. No frameworks, no build step — plain HTML, CSS and JavaScript.

## Preview locally

Double-click `index.html`, or serve it locally:

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>.

## Structure

```
portfolio/
├── index.html                       # All page content and sections
├── assets/
│   ├── css/styles.css               # Design system + every component
│   ├── js/main.js                   # Theme, nav, reveals, form, copy-email
│   ├── img/favicon.svg              # Monogram favicon
│   ├── img/og-image.png             # 1200×630 social preview
│   └── resume/DilshadAli_Ansari_Resume.pdf
├── site.webmanifest
├── robots.txt
└── DilshadAli_Ansari_RESUME 1.pdf   # Original résumé (source)
```

## What's included

- Hero with the headline banner on the left and a profile card on the right —
  portrait, quick stats, and a focus/status spec panel
- About, experience timeline, six project cards, skills, credentials, contact
- Light/dark theme toggle (saved in `localStorage`, respects `prefers-color-scheme`
  only through the toggle — defaults to dark)
- Scroll reveals, active-section nav, reading progress bar, subtle card spotlight
- Responsive down to small phones, keyboard-friendly, reduced-motion aware
- SEO meta tags, Open Graph image, JSON-LD `Person` schema
- Contact form wired for **Netlify Forms**; on other hosts it falls back to opening
  the visitor's email client

## Editing content

All copy lives directly in `index.html` — search for the section you want to
change. Design tokens (colors, fonts, spacing, radius) are at the top of
`assets/css/styles.css` under `:root` and `[data-theme="light"]`.

To swap the résumé, replace `assets/resume/DilshadAli_Ansari_Resume.pdf` and keep
the filename, or update the two download links in `index.html`.

## Deploy on Netlify

1. Drag the whole folder onto <https://app.netlify.com/drop>, or connect a repo.
2. No build command is needed; publish directory is the project root.
3. Netlify will detect the `contact` form automatically. Submissions appear under
   **Forms** in the dashboard.

After you have a domain, update two things:

- `og:image` / `twitter:image` in `index.html` to absolute URLs, e.g.
  `https://your-domain.com/assets/img/og-image.png`
- Add a `Sitemap:` line in `robots.txt` if you add a sitemap

## Design notes

- Type: Space Grotesk (UI), Instrument Serif (display accents), JetBrains Mono
  (labels and data)
- Palette: near-black `#08080a`, warm off-white `#f1efe9`, acid lime `#d8ff5f`
- Light theme: warm paper `#f4f1e8` with a deeper olive accent for readable text
