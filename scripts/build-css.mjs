// Builds dist/styles.css and dist/charts.css with licence banners, plus the
// IBM Plex fonts styles.css references.
import {
  copyFileSync,
  existsSync,
  realpathSync,
  mkdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as sass from 'sass';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

// Under pnpm, Carbon's own dependencies are not hoisted, so plain loadPaths do
// not find them: walk up node_modules from the importing file (real paths, so
// the next lookup starts inside the pnpm store), then from this package.
// IBM Products' Sass uses @carbon-labs/react-resizer without depending on it,
// so that one comes from this package's dependencies.
const packageImporter = {
  findFileUrl(url, { containingUrl }) {
    const match = /^(@[^/]+\/[^/]+)(\/.*)?$/.exec(url);
    if (!match) return null;
    const [, name, rest = ''] = match;
    const lookups = [
      ...(containingUrl ? [containingUrl] : []),
      pathToFileURL(join(root, 'package.json')),
    ].flatMap((from) => createRequire(from).resolve.paths(name) ?? []);
    const dir = lookups
      .map((modules) => join(modules, name))
      .find((candidate) => existsSync(candidate));
    return dir ? pathToFileURL(realpathSync(dir) + rest) : null;
  },
};

const started = Date.now();
mkdirSync(dist, { recursive: true });

function build(entry, file, banner) {
  const { css } = sass.compile(join(root, entry), {
    style: 'compressed',
    importers: [packageImporter],
    quietDeps: true,
  });
  // Sass starts non-ASCII output with a byte order mark; the banner goes after it.
  const bom = css.startsWith('\uFEFF') ? '\uFEFF' : '';
  writeFileSync(join(dist, file), bom + banner + css.slice(bom.length));
  return css;
}

const css = build(
  'src/styles/index.scss',
  'styles.css',
  '/*! @afframe/ui styles. Compiled from IBM Carbon, IBM Products and Carbon Labs Sass, Copyright IBM Corp., Apache-2.0 (LICENSES/Apache-2.0.txt); Afframe additions Copyright 2026 Hleb Tkachenko, PolyForm-Noncommercial-1.0.0 (LICENSES/PolyForm-Noncommercial-1.0.0.txt). IBM Plex fonts in ./fonts, OFL-1.1 (fonts/LICENSE.txt). */\n'
);
const chartsCss = build(
  'src/styles/charts.scss',
  'charts.css',
  '/*! @afframe/ui Carbon Charts styles. Compiled from Carbon Charts Sass, Copyright IBM Corp., Apache-2.0 (LICENSES/Apache-2.0.txt). */\n'
);

const plex = dirname(
  createRequire(import.meta.url).resolve('@ibm/plex/package.json')
);
const fonts = new Set(
  [...css.matchAll(/url\(["']?\.\/fonts\/([^"')?#]+)/g)].map((m) => m[1])
);
const missing = [];
for (const font of fonts) {
  const source = join(plex, font);
  try {
    statSync(source);
  } catch {
    missing.push(font);
    continue;
  }
  const target = join(dist, 'fonts', font);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}
if (missing.length > 0) {
  console.error(
    `build:css failed, fonts not found in @ibm/plex:\n${missing.join('\n')}`
  );
  process.exit(1);
}
copyFileSync(join(plex, 'LICENSE.txt'), join(dist, 'fonts', 'LICENSE.txt'));

console.log(
  `build:css: dist/styles.css ${css.length} bytes, ${fonts.size} fonts, dist/charts.css ${chartsCss.length} bytes, ${Date.now() - started} ms`
);
