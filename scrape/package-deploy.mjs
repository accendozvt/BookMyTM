// Build the two artefacts Hostinger needs.
//
//   bookmytm-next-deploy.zip  - the app source, uploaded to the Node app root,
//                               where the panel runs npm install && npm run build
//   public_html-assets.zip    - the contents of public/ with paths at the zip
//                               root, dropped into public_html
//
// Two uploads because public_html is served by LiteSpeed ahead of the Node app,
// so a static file only reaches the browser once it exists there too. Anything
// added to public/ after the last public_html upload 404s regardless of how many
// times the app is redeployed - that is what hid the logo and llms-full.txt.
import { readdirSync, statSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM';
const APP = join(ROOT, 'bookmytm-next');

// Everything the server needs to run the build; no node_modules, no .next.
const APP_ENTRIES = [
  'app', 'components', 'lib', 'scripts', 'content', 'content-posts', 'data', 'public',
  'package.json', 'package-lock.json', 'next.config.mjs', 'postcss.config.mjs',
  'tailwind.config.ts', 'tsconfig.json', 'next-env.d.ts',
];

const count = (dir) =>
  readdirSync(dir, { withFileTypes: true }).reduce(
    (n, e) => n + (e.isDirectory() ? count(join(dir, e.name)) : 1),
    0,
  );

function zip(outPath, baseDir, entries) {
  if (existsSync(outPath)) rmSync(outPath);
  const present = entries.filter((e) => existsSync(join(baseDir, e)));
  // Compress-Archive keeps the tree when handed top-level entries relative to the
  // working directory; handing it a flattened file list would store everything at
  // the archive root instead.
  const list = present.map((e) => `'${e.replace(/'/g, "''")}'`).join(',');
  execFileSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      `$ErrorActionPreference='Stop'; Set-Location -LiteralPath '${baseDir}'; ` +
        `Compress-Archive -Path ${list} -DestinationPath '${outPath}' -CompressionLevel Optimal`,
    ],
    { stdio: 'inherit' },
  );
  const files = present.reduce(
    (n, e) => n + (statSync(join(baseDir, e)).isDirectory() ? count(join(baseDir, e)) : 1),
    0,
  );
  return { files, bytes: statSync(outPath).size };
}

const a = zip(join(ROOT, 'bookmytm-next-deploy.zip'), APP, APP_ENTRIES);
console.log(`bookmytm-next-deploy.zip : ${a.files} files, ${(a.bytes / 1024 / 1024).toFixed(1)} MB`);

const b = zip(join(ROOT, 'public_html-assets.zip'), join(APP, 'public'), readdirSync(join(APP, 'public')));
console.log(`public_html-assets.zip   : ${b.files} files, ${(b.bytes / 1024 / 1024).toFixed(1)} MB`);
