// Checks the packed tarball's contents and the built dist/. Run after `build`.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';

const forbidden = [
  /\.stories\./,
  /\.mdx$/,
  /\.(test|spec)\./,
  /(^|\/)__tests__\//,
  /(^|\/)(stories|__story__)\//,
  /(^|\/)(__)?fixtures?(__)?\//,
  /^(src|examples|docs)\//,
];
const labsModules = readdirSync('src/labs')
  .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
  .map((name) => `dist/labs/${name.replace(/\.ts$/, '.js')}`);
if (labsModules.length === 0) {
  console.error('check:pack failed: no modules found in src/labs');
  process.exit(1);
}
// Folders whose index.ts is a 'use client' tsdown entry (tsdown.config.ts).
const clientFamilies = [
  'DataGrid',
  'FilterPanel',
  'AmountInput',
  'Charts',
  'ECharts',
  'AIChat',
  'CreateModal',
  'CreateSidePanel',
  'EditSidePanel',
  'EditTearsheet',
  'EditFullPage',
  'RemoveModal',
  'ImportModal',
  'ExportModal',
  'APIKeyModal',
  'AccentTag',
  'EnvironmentSwitcher',
  'LogoutBanner',
  'LogoutTile',
  'HelpMenu',
  'ChatElements',
  'ControlledDatePicker',
];
// Server-safe folders. tsdown inlines their pure re-export index.ts, so the
// component file is the one required.
const serverFamilies = ['Amount', 'StatusIndicator', 'DescriptionList'];
// Heavy extras: none imports another, so a route pays only for the ones it
// renders. ChatElements is the one family that renders two of them.
const heavyFamilies = ['Charts', 'ECharts', 'DataGrid', 'AIChat'];
const chatElementEngines = ['Charts', 'ECharts'];
const shellFamilies = [
  'EnvironmentSwitcher',
  'LogoutBanner',
  'LogoutTile',
  'HelpMenu',
];
// One 'use client' module per client family, plus the theme hook.
const familyModules = [
  ...clientFamilies.map((name) => `dist/components/${name}/index.js`),
  'dist/theme/use-afframe-theme.js',
];
const required = [
  'dist/index.js',
  'dist/index.d.ts',
  'dist/styles.css',
  'dist/charts.css',
  'dist/provider/AfframeProvider.js',
  ...labsModules,
  ...familyModules,
  ...serverFamilies.map((name) => `dist/components/${name}/${name}.js`),
  'dist/fonts/LICENSE.txt',
  'LICENSES/Apache-2.0.txt',
  'LICENSES/PolyForm-Noncommercial-1.0.0.txt',
];

const output = execFileSync(
  'npm',
  ['pack', '--dry-run', '--json', '--ignore-scripts'],
  { encoding: 'utf8' }
);
// npm 11 prints an array, npm 12 an object keyed by package name.
const [pack] = Object.values(JSON.parse(output));
const files = pack.files.map((file) => file.path);

const problems = [
  ...files
    .filter((path) => forbidden.some((pattern) => pattern.test(path)))
    .map((path) => `must not ship: ${path}`),
  ...required
    .filter((path) => !files.includes(path))
    .map((path) => `missing: ${path}`),
];

// Every `exports` target ships, and each JavaScript entry loads through the
// package name with at least one export.
const { exports } = JSON.parse(readFileSync('package.json', 'utf8'));
for (const [subpath, target] of Object.entries(exports)) {
  const targets = typeof target === 'string' ? [target] : Object.values(target);
  for (const path of targets.map((path) => path.replace(/^\.\//, ''))) {
    if (!files.includes(path)) problems.push(`missing ${subpath}: ${path}`);
  }
  if (typeof target === 'string') continue;
  const specifier = `@afframe/ui${subpath.slice(1)}`;
  try {
    if (Object.keys(await import(specifier)).length === 0) {
      problems.push(`${specifier} has no exports`);
    }
  } catch (error) {
    problems.push(`${specifier} does not load: ${error.message}`);
  }
}

if (!files.some((path) => /^dist\/fonts\/.+\.woff2$/.test(path))) {
  problems.push('missing: dist/fonts/**/*.woff2');
}

const read = (path) => (files.includes(path) ? readFileSync(path, 'utf8') : '');

// tsdown inlines re-export modules, so dist/index.js imports a family's
// component files directly: each of those must carry the directive too.
const familyImport = new RegExp(
  `from\\s+["']\\./(components/(?:${clientFamilies.join('|')})/[^"']+)["']`,
  'g'
);
const familyImports = [...read('dist/index.js').matchAll(familyImport)].map(
  ([, path]) => `dist/${path}`
);
const clientModules = [
  'dist/provider/AfframeProvider.js',
  ...labsModules,
  ...new Set([...familyModules, ...familyImports]),
];
for (const path of clientModules) {
  const code = read(path);
  if (!/^['"]use client['"]/.test(code)) {
    problems.push(`${path} must start with "use client"`);
  }
  if (/^\s*export\s*\*/m.test(code)) {
    problems.push(`${path} must not use export *`);
  }
}

// Component files never import the barrel (circular import) or a Labs module
// or package (Labs JS would ship on every route using the component).
// Relative specifiers are resolved, so `../index.js` from a subfolder passes.
const componentFiles = files.filter(
  (path) => path.startsWith('dist/components/') && path.endsWith('.js')
);
for (const path of componentFiles) {
  const code = read(path);
  const family = path.split('/')[2];
  for (const [, specifier] of code.matchAll(
    /(?:\bfrom|\bimport)\s*\(?\s*["'](@carbon-labs\/[^"']*)["']/g
  )) {
    problems.push(`${path} must not import a Labs package (${specifier})`);
  }
  for (const [, specifier] of code.matchAll(
    /(?:\bfrom|\bimport)\s*\(?\s*["'](\.[^"']*)["']/g
  )) {
    const target = posix.join(posix.dirname(path), specifier);
    if (target === 'dist/index.js') {
      problems.push(`${path} must not import the barrel (${specifier})`);
    }
    if (target.startsWith('dist/labs/')) {
      problems.push(`${path} must not import Labs (${specifier})`);
      if (shellFamilies.includes(family)) {
        problems.push(
          `${path}: shell header family ${family} must not import Labs (${specifier})`
        );
      }
    }
    const [, , targetFamily] = target.split('/');
    if (!target.startsWith('dist/components/') || targetFamily === family) {
      continue;
    }
    if (
      heavyFamilies.includes(family) &&
      heavyFamilies.includes(targetFamily)
    ) {
      problems.push(
        `${path}: heavy family ${family} must not import ${targetFamily} (${specifier})`
      );
    }
    if (family === 'AIChat' && targetFamily === 'ChatElements') {
      problems.push(`${path} must not import ChatElements (${specifier})`);
    }
    if (family === 'ChatElements') {
      if (targetFamily === 'AIChat') {
        problems.push(
          `${path} must not import AIChat values, only its types (${specifier})`
        );
      }
      if (targetFamily === 'DataGrid') {
        problems.push(`${path} must not import DataGrid (${specifier})`);
      }
      if (
        chatElementEngines.includes(targetFamily) &&
        target !== `dist/components/${targetFamily}/index.js`
      ) {
        problems.push(
          `${path} must import ${targetFamily} through ../${targetFamily}/index.js only (${specifier})`
        );
      }
    }
  }
  if (serverFamilies.includes(family) && /^['"]use client['"]/.test(code)) {
    problems.push(
      `${path} is server-safe and must not start with "use client"`
    );
  }
}

for (const path of files.filter((path) =>
  /^dist\/format\/.+\.js$/.test(path)
)) {
  if (/^['"]use client['"]/.test(read(path))) {
    problems.push(
      `${path} is server-safe and must not start with "use client"`
    );
  }
}

const styles = read('dist/styles.css');
const contents = [
  {
    what: 'the v12 field border',
    pattern:
      /calc\(100% - 4px\),\s*var\(--cds-border-strong\)\s*100%\)\s*border-box/,
  },
  {
    what: 'the dark theme',
    pattern:
      /\[data-afframe-theme=(dark|'dark'|"dark")\]\s*\{[^}]*--cds-background:\s*#161616/,
  },
  {
    what: 'the system theme',
    pattern:
      /prefers-color-scheme:\s*dark\)\s*\{\s*:root\[data-afframe-theme=(system|'system'|"system")\]\s*\{[^}]*--cds-background:\s*#161616/,
  },
];
for (const { what, pattern } of contents) {
  if (!pattern.test(styles)) problems.push(`dist/styles.css lacks ${what}`);
}
if (styles.includes('cds--cc--')) {
  problems.push('dist/styles.css must not carry Carbon Charts (cds--cc--)');
}
const charts = read('dist/charts.css');
if (!/\.cds--cc--chart-wrapper\b/.test(charts)) {
  problems.push('dist/charts.css lacks the Carbon Charts styles');
}
const chartsBanner = charts.replace(/^\uFEFF/, '').split('\n')[0];
if (!chartsBanner.startsWith('/*!') || !chartsBanner.includes('Apache-2.0')) {
  problems.push('dist/charts.css lacks the licence banner');
}

const banner = styles.replace(/^\uFEFF/, '').split('\n')[0];
if (
  !banner.startsWith('/*!') ||
  !banner.includes('Apache-2.0') ||
  !banner.includes('PolyForm-Noncommercial-1.0.0') ||
  !banner.includes('OFL-1.1')
) {
  problems.push('dist/styles.css lacks the licence banner');
}

console.log(files.sort().join('\n'));

if (problems.length > 0) {
  console.error(`\ncheck:pack failed:\n${problems.join('\n')}`);
  process.exit(1);
}

console.log(`\ncheck:pack passed: ${files.length} files`);
