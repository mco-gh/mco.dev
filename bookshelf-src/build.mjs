// Rebuild static/bookshelf/vendor/ after upgrading a dependency: `npm run build`.
import { copyFile } from 'node:fs/promises';
import { build } from 'esbuild';

const out = new URL('../static/bookshelf/vendor/', import.meta.url);

await build({
  entryPoints: ['vendor-entry.js'],
  outfile: new URL('anthropic.js', out).pathname,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  legalComments: 'none',
});
await copyFile('node_modules/interestfor/src/interestfor.min.js', new URL('interestfor.min.js', out));
console.log('Built static/bookshelf/vendor/');
