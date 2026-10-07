// Checks the running example app (examples/nextjs); run from the root after `build`.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const base = process.env.EXAMPLE_URL ?? 'http://localhost:3100';

// Strings unique to two Labs packages; `/` renders TextHighlighter.
const labsMarkers = ['trial-countdown', 'whats-new'];

// Strings unique to each extra's library; `lazy` markers live in import() chunks.
const extras = [
  { name: 'charts', markers: [{ marker: 'cds--cc--', lazy: false }] },
  { name: 'echarts', markers: [{ marker: '_echarts_instance_', lazy: false }] },
  {
    name: 'data-grid',
    markers: [{ marker: 'afframe-data-grid', lazy: false }],
  },
  {
    name: 'ai-chat',
    markers: [
      { marker: 'cds-aichat-react', lazy: true },
      { marker: 'conversational_search', lazy: false },
    ],
  },
];
const extrasMarkers = extras.flatMap(({ markers }) => markers);
const lazyMarkers = extrasMarkers
  .filter(({ lazy }) => lazy)
  .map(({ marker }) => marker);

// `markers`: the strings a page's script tags must carry; every other Labs and
// extras marker must be absent.
const pages = [
  { path: '/', theme: 'light', markers: [] },
  { path: '/dark', theme: 'dark', markers: [] },
  { path: '/system', theme: 'system', markers: [] },
  { path: '/labs', theme: 'light', markers: labsMarkers },
  { path: '/afframe', theme: 'light', markers: [] },
  {
    path: '/extras',
    theme: 'light',
    markers: extrasMarkers
      .filter(({ lazy }) => !lazy)
      .map(({ marker }) => marker),
  },
  // The chat alone: its enum marker in the script tags, its lazy marker only
  // in async chunks, none of Charts, ECharts or the data grid.
  { path: '/chat', theme: 'light', markers: ['conversational_search'] },
  { path: '/shell', theme: 'light', markers: [] },
  // The engines load lazily: only the chat's enum marker is in the script
  // tags (the demo chat replies with MessageResponseTypes.USER_DEFINED).
  {
    path: '/chat-elements',
    theme: 'light',
    markers: ['conversational_search'],
  },
];

// Carbon v12 text input border, only present with the v12 flags compiled in.
const v12Marker =
  /calc\(100% - 4px\),\s*var\(--cds-border-strong\)\s*100%\)\s*border-box/;
const darkTheme =
  /\[data-afframe-theme=(dark|'dark'|"dark")\]\s*\{[^}]*--cds-background\s*:\s*#161616/i;
const systemTheme =
  /prefers-color-scheme:\s*dark\)\s*\{\s*:root\[data-afframe-theme=(system|'system'|"system")\]\s*\{[^}]*--cds-background\s*:\s*#161616/i;

const failures = [];

function check(ok, message) {
  if (ok) {
    console.log(`ok   ${message}`);
  } else {
    console.error(`FAIL ${message}`);
    failures.push(message);
  }
}

async function get(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} returned ${response.status}`);
  }
  return response.text();
}

function scriptSrcs(html) {
  return [...html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/g)].map(([, src]) =>
    src.replaceAll('&amp;', '&')
  );
}

function stylesheetHrefs(html) {
  const hrefs = [];
  for (const [tag] of html.matchAll(/<link\b[^>]*>/g)) {
    if (!/\brel="stylesheet"/.test(tag)) continue;
    const href = /\bhref="([^"]+)"/.exec(tag)?.[1];
    if (href) hrefs.push(href.replaceAll('&amp;', '&'));
  }
  return hrefs;
}

const cssUrls = new Set();
const cssUrlsByPath = new Map();
const scripts = new Map();

const htmlByPath = new Map();
const jsByPath = new Map();
for (const { path, theme, markers } of pages) {
  const html = await get(new URL(path, base));
  htmlByPath.set(path, html);
  check(html.includes('cds--text-input'), `${path} renders cds--text-input`);
  check(
    new RegExp(`<html\\b[^>]*data-afframe-theme="${theme}"`).test(html),
    `${path} has data-afframe-theme="${theme}" on <html>`
  );
  if (path === '/') {
    check(
      html.includes('clabs--text-highlighter__container'),
      `${path} renders the Labs TextHighlighter from a server component`
    );
  }
  let js = '';
  for (const src of scriptSrcs(html)) {
    const url = new URL(src, base).href;
    if (!scripts.has(url)) scripts.set(url, await get(url));
    js += scripts.get(url);
  }
  jsByPath.set(path, js);
  for (const marker of [
    ...labsMarkers,
    ...extrasMarkers.map(({ marker }) => marker),
  ]) {
    // A lazily loaded library sits in async chunks: only its absence counts.
    if (lazyMarkers.includes(marker) && path === '/extras') continue;
    const expected = markers.includes(marker);
    check(
      js.includes(marker) === expected,
      `${path} client JavaScript ${expected ? 'has' : 'has no'} ${marker}`
    );
  }
  const hrefs = stylesheetHrefs(html);
  check(hrefs.length > 0, `${path} links a stylesheet`);
  const urls = hrefs.map((href) => new URL(href, base).href);
  cssUrlsByPath.set(path, urls);
  for (const url of urls) cssUrls.add(url);
}

// /extras renders each extra's container on the server and a CZK amount
// formatted by Node's ICU: 1 234,50 Kč with no-break spaces (U+00A0).
const extrasHtml = htmlByPath.get('/extras') ?? '';
for (const { name } of extras) {
  check(
    extrasHtml.includes(`data-afframe-extra="${name}"`),
    `/extras renders data-afframe-extra="${name}"`
  );
}
const czk = '1\u00a0234,50\u00a0K\u010d';
check(
  extrasHtml.includes(`data-testid="czk">${czk}<`),
  '/extras renders 1234.5 as 1 234,50 Kč with U+00A0 separators'
);

// /afframe: the rendered markup, not the props in the RSC payload.
const afframeHtml = htmlByPath.get('/afframe') ?? '';
check(
  /<\/svg>Deployed</.test(afframeHtml),
  '/afframe renders the StatusIndicator label Deployed'
);
check(
  /class="cds--structured-list[ "]/.test(afframeHtml),
  '/afframe renders the DescriptionList as a cds--structured-list'
);
check(
  /class="cds--tag__label"[^>]*>Billing</.test(afframeHtml),
  '/afframe renders the AccentTag text Billing'
);

check(
  (htmlByPath.get('/chat') ?? '').includes('data-afframe-extra="ai-chat"'),
  '/chat renders data-afframe-extra="ai-chat"'
);

// /shell: computed or markup-shaped text, not the props in the RSC payload.
const shellHtml = htmlByPath.get('/shell') ?? '';
check(
  /class="afframe-environment-switcher-current"[^>]*>Staging</.test(shellHtml),
  '/shell renders the current environment name Staging'
);
check(
  shellHtml.includes('>Documentation<'),
  '/shell renders the HelpMenu item Documentation'
);
check(
  shellHtml.includes('Your session ends in 5 minutes.') &&
    shellHtml.includes('You have been signed out.'),
  '/shell renders both LogoutBanner variants'
);
check(
  shellHtml.includes('Signed in as Sample User') &&
    /<a [^>]*href="\/auth\/sign-out"/.test(shellHtml),
  '/shell renders LogoutTile with its sign-out link from a server component'
);

// /chat-elements: the chart's container and its summary, outside the lazy
// engines.
const elementsHtml = htmlByPath.get('/chat-elements') ?? '';
for (const extra of ['chat-elements', 'ai-chat']) {
  check(
    elementsHtml.includes(`data-afframe-extra="${extra}"`),
    `/chat-elements renders data-afframe-extra="${extra}"`
  );
}
check(
  elementsHtml.includes('class="afframe-chat-chart"'),
  '/chat-elements renders afframe-chat-chart'
);
check(
  elementsHtml.includes('Revenue by quarter: Q1 12, Q2 18, Q3 9.'),
  '/chat-elements renders the chart summary'
);

// Every extra's library is in the build output, lazy chunks included.
const chunksDir = join(
  process.env.EXAMPLE_DIR ?? 'examples/nextjs',
  '.next/static/chunks'
);
const chunks = readdirSync(chunksDir, { recursive: true })
  .filter((file) => file.endsWith('.js'))
  .map((file) => ({
    file: file.replaceAll('\\', '/'),
    code: readFileSync(join(chunksDir, file), 'utf8'),
  }));
for (const { marker } of extrasMarkers) {
  const count = chunks.filter(({ code }) => code.includes(marker)).length;
  check(count > 0, `${chunksDir} has ${marker} (${count} chunk(s))`);
}

// /chat-elements loads each engine lazily: its client JavaScript names a chunk
// that holds the engine's marker. Turbopack shares these chunks with /extras,
// so their mere presence proves nothing about this route.
const elementsJs = jsByPath.get('/chat-elements') ?? '';
for (const marker of ['cds--cc--', '_echarts_instance_']) {
  const named = chunks.some(
    ({ file, code }) =>
      code.includes(marker) && elementsJs.includes(`/chunks/${file}`)
  );
  check(
    named,
    `/chat-elements client JavaScript loads a chunk with ${marker} lazily`
  );
}

let css = '';
let fontUrl;
const cssByUrl = new Map();
for (const url of cssUrls) {
  const text = await get(url);
  cssByUrl.set(url, text);
  css += text;
  const font = /url\(\s*["']?([^"')]+\.woff2)["']?\s*\)/.exec(text)?.[1];
  if (font && !fontUrl) fontUrl = new URL(font, url).href;
}

check(v12Marker.test(css), 'CSS has the v12 text input border');
check(darkTheme.test(css), 'CSS has the dark theme on data-afframe-theme=dark');
check(
  systemTheme.test(css),
  'CSS has the dark theme for data-afframe-theme=system under prefers-color-scheme'
);
for (const { path } of pages) {
  const expected = ['/extras', '/chat-elements'].includes(path);
  const pageCss = (cssUrlsByPath.get(path) ?? [])
    .map((url) => cssByUrl.get(url))
    .join('');
  check(
    /\.cds--cc--chart-wrapper\b/.test(pageCss) === expected,
    `${path} CSS ${expected ? 'has' : 'lacks'} the Carbon Charts .cds--cc--chart-wrapper styles`
  );
}
check(fontUrl !== undefined, 'CSS references a woff2 font');
if (fontUrl) {
  const response = await fetch(fontUrl);
  check(response.ok, `font ${fontUrl} returns ${response.status}`);
}

// No second Carbon compile: .cds--btn selectors and bytes of the package
// styles against a recorded baseline (same regex as its count).
const baseline = { buttons: 251, bytes: 2_208_572 };
const styles = readFileSync('dist/styles.css', 'utf8');
const buttons = styles.match(/\.cds--btn[^a-zA-Z0-9_-]/g)?.length ?? 0;
const bytes = Buffer.byteLength(styles);
console.log(
  `dist/styles.css: .cds--btn ${buttons} (baseline ${baseline.buttons}), ${bytes} B (baseline ${baseline.bytes} B)`
);
check(
  buttons < 2 * baseline.buttons && bytes < 2 * baseline.bytes,
  'dist/styles.css has not doubled'
);

if (failures.length > 0) {
  console.error(`\ncheck-example: ${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\ncheck-example: all checks passed');
