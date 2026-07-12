# BookMyTM

A clean rebuild of [bookmytm.com](https://bookmytm.com) — India's platform for trademark registration, ISO certification, startup/company registration, intellectual property, and statutory compliance. Migrated from a WordPress/Elementor site to a modern static-export **Next.js** app.

## Structure

| Path | What it is |
|------|------------|
| `bookmytm-next/` | The Next.js 15 app (App Router, Tailwind, static export) — the deployable site |
| `scrape/` | Node scripts that scraped the original WordPress site, extracted content, and downloaded images |
| `scrape/data/`, `scrape/data-posts/` | Extracted page & blog content as structured JSON (source for the app's `content/`) |
| `scrape/html/`, `scrape/html-posts/` | Raw HTML snapshot of the original site (archive) |
| `index.html` | Original single-file header/home/footer build (superseded by `bookmytm-next/`) |

## Develop

```bash
cd bookmytm-next
npm install
npm run dev        # http://localhost:3000
```

## Build (static export)

```bash
cd bookmytm-next
npm run build      # outputs static site to bookmytm-next/out/
```

The `out/` folder is a fully static site (HTML/CSS/JS) that can be served by any host.

## What's included

- 87 pages + 35 blog posts, content preserved verbatim from the original site
- Per-page SEO metadata, Open Graph & Twitter cards, `sitemap.xml`, `robots.txt`, `llms.txt`, FAQ/Article/Organization JSON-LD
- Mega-menu navigation, per-service WhatsApp lead forms with pricing, two-column FAQ, Knowledge Base
- All images downloaded and served locally from `public/images/`
