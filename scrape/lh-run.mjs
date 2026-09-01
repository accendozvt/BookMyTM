// Lighthouse runner — mobile + desktop presets over a page set.
// Usage: node lh-run.mjs <outDir> [--all]
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const OUT = join('D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit', process.argv[2] || 'baseline');
const ORIGIN = 'http://localhost:' + (process.env.BMTM_PORT || '3187');
mkdirSync(OUT, { recursive: true });

// Guard: another project once occupied the port we assumed, silently producing a
// baseline for the wrong site. Refuse to measure anything that isn't BookMyTM.
{
  const html = await fetch(ORIGIN + '/').then((r) => r.text());
  if (!/BookMyTM/.test(html)) {
    console.error('ABORT: ' + ORIGIN + ' is not serving BookMyTM.');
    process.exit(1);
  }
  console.log('identity OK — BookMyTM on ' + ORIGIN + '\n');
}

// One page per template archetype. Running all 140 x 2 presets would take ~2h;
// these 10 cover every distinct rendering path in the app.
const ARCHETYPES = [
  ['home', '/'],
  ['hub-category', '/intellectual-property/'],
  ['service-leaf', '/intellectual-property/trademark/trademark-registration-in-kerala/'],
  ['knowledge-base', '/knowledge-base/'],
  ['blog-new-local-img', '/gs1-barcode-registration-india-guide/'],
  ['blog-old-remote-img', '/amazon-brand-registry-india-requirements-benefits-how-to-apply-2025/'],
  ['contact-maps-iframe', '/contact/'],
  ['about', '/about-us/'],
  ['legal', '/privacy-policy/'],
  // The 404 page is deliberately excluded: Lighthouse reports ERRORED_DOCUMENT_REQUEST
  // for any non-2xx response, so it is verified separately (status + noindex + content).
];

const ONLY = process.env.BMTM_ONLY ? process.env.BMTM_ONLY.split(",") : null;
const pages0 = process.argv.includes('--all')
  ? readFileSync('D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit/route-inventory.txt', 'utf8')
      .split('\n').filter(Boolean).filter((r) => r !== '/_not-found/')
      .map((r) => [r.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home', r])
  : ARCHETYPES;
const pages = ONLY ? pages0.filter(([n]) => ONLY.includes(n)) : pages0;

const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const rows = [];

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });

for (const [name, path] of pages) {
  for (const preset of ['mobile', 'desktop']) {
    const opts = { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: CATS };
    let res;
    try {
      res = await lighthouse(ORIGIN + path, opts, preset === 'desktop' ? desktopConfig : undefined);
    } catch (e) {
      console.log(`FAIL ${name} ${preset}: ${e.message}`);
      continue;
    }
    const lhr = res.lhr;
    const scores = Object.fromEntries(CATS.map((c) => [c, Math.round((lhr.categories[c]?.score ?? 0) * 100)]));
    const m = lhr.audits;
    rows.push({
      name, path, preset, ...scores,
      lcp: m['largest-contentful-paint']?.numericValue ?? null,
      cls: m['cumulative-layout-shift']?.numericValue ?? null,
      tbt: m['total-blocking-time']?.numericValue ?? null,
    });
    writeFileSync(join(OUT, `${name}.${preset}.json`), JSON.stringify(lhr));
    console.log(
      `${name.padEnd(22)} ${preset.padEnd(8)} P${String(scores.performance).padStart(3)} ` +
      `A${String(scores.accessibility).padStart(3)} BP${String(scores['best-practices']).padStart(3)} ` +
      `S${String(scores.seo).padStart(3)}  LCP ${((rows.at(-1).lcp || 0) / 1000).toFixed(2)}s ` +
      `CLS ${(rows.at(-1).cls ?? 0).toFixed(3)} TBT ${Math.round(rows.at(-1).tbt || 0)}ms`,
    );
  }
}

await chrome.kill();
writeFileSync(join(OUT, 'summary.json'), JSON.stringify(rows, null, 2));
console.log('\nSaved ' + rows.length + ' runs to ' + OUT);
