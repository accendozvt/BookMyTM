# BookMyTM

A clean rebuild of [bookmytm.com](https://bookmytm.com) — India's platform for trademark registration, ISO certification, startup/company registration, intellectual property, and statutory compliance. Migrated from a WordPress/Elementor site to a **Next.js 15** app.

## Structure

| Path | What it is |
|------|------------|
| `bookmytm-next/` | The Next.js 15 app (App Router, Tailwind) — the deployable site |
| `scrape/` | Node scripts that scraped the original WordPress site, extracted content, downloaded images, and now generate imagery and package deploys |
| `scrape/data/`, `scrape/data-posts/` | Extracted page & blog content as structured JSON (source for the app's `content/`) |
| `scrape/html/`, `scrape/html-posts/` | Raw HTML snapshot of the original site (archive) |
| `seo-audit/` | Technical SEO audit report and its supporting data |

## Develop

```bash
cd bookmytm-next
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
cd bookmytm-next
npm run build      # prerenders 141 pages into .next/
npm start          # serves them with next start
```

Pages are prerendered at build time, but this is **not** a static export — there is
no `output: 'export'`, so there is no `out/` folder and the site needs a Node
runtime. `next start` is what serves it.

## Deploy

Hostinger Node.js hosting, and it takes two artefacts. `scrape/package-deploy.mjs`
builds both:

| Artefact | Goes to | Why |
|---|---|---|
| `bookmytm-next-deploy.zip` | Node app, via the panel's deployment upload | The panel then runs `npm install && npm run build` |
| `public_html-assets.zip` | `public_html` | LiteSpeed serves `public_html` **ahead of** the Node app, so a file in `public/` stays 404 until it also exists there |

That second destination is the easy one to forget — it is what left the logo and
`llms-full.txt` returning 404 for weeks. `.github/workflows/deploy.yml` now syncs
it over FTPS on every push to `main`, so only the zip upload is manual.

## What's included

- 141 pages: 87 service/content pages and 55 blog posts, content preserved verbatim from the original site
- Per-page SEO metadata, Open Graph & Twitter cards, `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, FAQ/Article/Service/Organization JSON-LD
- Mega-menu navigation, per-service WhatsApp lead forms with pricing, two-column FAQ, Knowledge Base
- All images served locally from `public/images/`, each service page and blog post carrying its own image and alt text
