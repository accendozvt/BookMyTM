// Phase 5 audit: heading order, image alt text, link text, landmarks, skip link.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const BUILT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next/.next/server/app';
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) files.push(p);
  }
})(BUILT);

const strip = (s) => s.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const GENERIC = /^(read more|click here|here|more|learn more|read|link|this|details|view|see more|continue)$/i;

const out = {
  headingSkips: [], multiH1: [], noH1: [],
  imgNoAlt: [], imgFilenameAlt: [],
  genericLinks: [], emptyLinks: [],
  noMain: [], noHeader: [], noFooter: [], navNoLabel: [], noSkipLink: [],
};

for (const f of files) {
  const route = '/' + relative(BUILT, f).split(/[\\/]/).join('/').replace(/\.html$/, '').replace(/^index$/, '');
  const html = readFileSync(f, 'utf8');

  // headings
  const hs = [...html.matchAll(/<h([1-6])\b[^>]*>(.*?)<\/h\1>/gs)].map((m) => ({ lvl: +m[1], text: strip(m[2]).slice(0, 50) }));
  const h1s = hs.filter((h) => h.lvl === 1);
  if (h1s.length === 0) out.noH1.push(route);
  if (h1s.length > 1) out.multiH1.push(`${route} (${h1s.length})`);
  for (let i = 1; i < hs.length; i++) {
    if (hs[i].lvl > hs[i - 1].lvl + 1) {
      out.headingSkips.push(`${route}: h${hs[i - 1].lvl} -> h${hs[i].lvl}  "${hs[i].text}"`);
    }
  }

  // images
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const alt = (tag.match(/\salt="([^"]*)"/) || [])[1];
    const src = (tag.match(/\ssrc="([^"]*)"/) || [])[1] || '';
    if (alt === undefined) out.imgNoAlt.push(`${route}: ${src.slice(-52)}`);
    else if (alt) {
      const file = src.split('/').pop()?.replace(/\.\w+$/, '').replace(/[-_]/g, ' ').toLowerCase() || '';
      if (file && alt.toLowerCase().replace(/[-_]/g, ' ') === file) out.imgFilenameAlt.push(`${route}: alt="${alt.slice(0, 40)}"`);
    }
  }

  // links
  for (const m of html.matchAll(/<a\b([^>]*)>(.*?)<\/a>/gs)) {
    const attrs = m[1];
    const text = strip(m[2]);
    const label = (attrs.match(/aria-label="([^"]*)"/) || [])[1];
    const href = (attrs.match(/href="([^"]*)"/) || [])[1] || '';
    if (!text && !label && !/<img/.test(m[2]) && !/<svg/.test(m[2])) out.emptyLinks.push(`${route}: href=${href.slice(0, 40)}`);
    else if (text && GENERIC.test(text) && !label) out.genericLinks.push(`${route}: "${text}" -> ${href.slice(0, 40)}`);
  }

  // landmarks
  if (!/<main\b/.test(html)) out.noMain.push(route);
  if (!/<header\b/.test(html)) out.noHeader.push(route);
  if (!/<footer\b/.test(html)) out.noFooter.push(route);
  const navs = [...html.matchAll(/<nav\b([^>]*)>/g)];
  if (navs.some((n) => !/aria-label=/.test(n[1]))) out.navNoLabel.push(route);
  if (!/skip[- ]?to[- ]?(main|content)/i.test(html)) out.noSkipLink.push(route);
}

console.log(`pages: ${files.length}\n`);
const show = (k, label, sample = 4) => {
  const v = out[k];
  console.log(`${label.padEnd(34)} ${String(v.length).padStart(4)}`);
  [...new Set(v)].slice(0, sample).forEach((x) => console.log(`      ${x}`));
};
show('noH1', 'pages with NO h1');
show('multiH1', 'pages with >1 h1');
show('headingSkips', 'heading-level skips', 6);
show('imgNoAlt', 'images with NO alt attribute', 6);
show('imgFilenameAlt', 'alt text == filename', 4);
show('emptyLinks', 'links with no accessible text', 4);
show('genericLinks', 'generic link text', 6);
show('noMain', 'pages missing <main>');
show('noHeader', 'pages missing <header>');
show('noFooter', 'pages missing <footer>');
show('navNoLabel', '<nav> without aria-label', 3);
show('noSkipLink', 'pages without skip link', 2);
