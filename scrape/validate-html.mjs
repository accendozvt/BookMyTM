// Validate every prerendered page with html-validate's Node API.
// Uses the API rather than the CLI because 141 paths blow past the Windows
// command-line length limit.
import { HtmlValidate } from 'html-validate';
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

const htmlvalidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    // Framework output and stylistic preferences, not W3C validity problems:
    'no-inline-style': 'off',
    'require-sri': 'off',
    'long-title': 'off',
    'no-trailing-whitespace': 'off',
    'attribute-boolean-style': 'off',
    'void-style': 'off',
    'no-implicit-button-type': 'off',
    'prefer-native-element': 'off',
    // html-validate prefers &nbsp; inside phone numbers; a plain space is valid HTML.
    'tel-non-breaking': 'off',
    // React emits srcSet/fetchPriority camelCase. HTML attribute names are
    // case-insensitive per spec, so the parser lowercases them — valid.
    'attr-case': 'off',
    // React 19 useId produces ids like "_R_". HTML5 allows any non-empty string
    // without spaces as an id; the "must start with a letter" rule is HTML4.
    'valid-id': 'off',
    'attribute-empty-style': 'off',
  },
});

const byRule = {};
let total = 0;
const examples = [];

for (const f of files) {
  const report = await htmlvalidate.validateString(readFileSync(f, 'utf8'), f);
  for (const r of report.results) {
    for (const m of r.messages) {
      byRule[m.ruleId] = (byRule[m.ruleId] || 0) + 1;
      total++;
      if (examples.length < 10) examples.push(`${relative(BUILT, f)}:${m.line} ${m.ruleId} — ${m.message.slice(0, 80)}`);
    }
  }
}

console.log(`pages validated: ${files.length}`);
console.log(`errors: ${total}`);
Object.entries(byRule).sort((a, b) => b[1] - a[1]).forEach(([r, n]) => console.log(`  ${String(n).padStart(4)}x  ${r}`));
examples.forEach((e) => console.log('   ' + e));
if (!total) console.log('  (clean)');
process.exit(total ? 1 : 0);
