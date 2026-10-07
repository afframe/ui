// Writes docs/registry.json and docs/registry.md from src/index.ts, the
// subpath entries and a scan of src/components. `--check` writes nothing and
// fails on drift, on an Afframe folder without stories, test, visual test or
// docs page, and on an export whose module or docs page does not exist.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { format, resolveConfig } from 'prettier';

const root = join(import.meta.dirname, '..');
const rel = (path) => relative(root, path);
const read = (path) => readFileSync(path, 'utf8');
const check = process.argv.includes('--check');
const problems = [];

// A directive is the first statement, after any leading comments.
function usesClient(path) {
  let code = read(path);
  for (;;) {
    code = code.trimStart();
    const end = code.startsWith('//')
      ? code.indexOf('\n')
      : code.startsWith('/*')
        ? code.indexOf('*/') + 1
        : -2;
    if (end === -2) break;
    code = end < 0 ? '' : code.slice(end + 1);
  }
  return /^['"]use client['"]/.test(code);
}
const statusOf = (name) =>
  name.startsWith('previewCandidate__')
    ? 'preview-candidate'
    : name.startsWith('preview__')
      ? 'preview'
      : 'stable';
const baseName = (name) => name.replace(/^[a-zA-Z]+__/, '');

// Kind from the loaded value, not the name: a context or constant object is
// a util even when capitalised; an object of components is a namespace.
const renderable = ['forward_ref', 'memo', 'lazy'].map((type) =>
  Symbol.for(`react.${type}`)
);
const isComponent = (name, value) =>
  (typeof value === 'function' && /^[A-Z]/.test(baseName(name))) ||
  renderable.includes(value?.$$typeof);
const kindOf = (name, value) =>
  /^use[A-Z]/.test(baseName(name))
    ? 'hook'
    : isComponent(name, value)
      ? 'component'
      : typeof value === 'object' &&
          Object.keys(value ?? {}).length > 0 &&
          Object.entries(value).every(([key, part]) => isComponent(key, part))
        ? 'namespace'
        : 'util';

// A folder's docs page, story title, source tag and Afframe parts.
function scan(dir, name) {
  const files = readdirSync(dir);
  const stories = [
    ...files,
    ...(files.includes('stories')
      ? readdirSync(join(dir, 'stories')).map((file) => `stories/${file}`)
      : []),
  ].filter((file) => file.endsWith('.stories.tsx'));
  const code = stories.map((file) => read(join(dir, file)));
  // The meta title is the first title that names a sidebar path; a folder
  // without a main story file takes the path its stories share.
  const titles = code.map(
    (text) => /title:\s*'([^']*\/[^']*)'/.exec(text)?.[1]
  );
  const main = stories.indexOf(`${name}.stories.tsx`);
  let storyTitle = main >= 0 ? titles[main] : (titles[0] ?? null);
  if (main < 0 && titles.length > 1) {
    const parts = titles.map((title) => title.split('/'));
    storyTitle =
      parts[0]
        .filter((part, i) => parts.every((other) => other[i] === part))
        .join('/') || null;
  }
  const docs = files.includes(`${name}.mdx`)
    ? `${name}.mdx`
    : files.find((file) => file.endsWith('.mdx'));
  const tags = code.map((text) => /^\s+tags: \[([^\]]*)\]/m.exec(text)?.[1]);
  const source = ['afframe', 'extras', 'carbon', 'ibm-products', 'labs'].find(
    (tag) => tags.join(',').includes(`'${tag}'`)
  );
  return {
    folder: rel(dir),
    source,
    owned: source === 'afframe' && files.includes('index.ts'),
    docs: docs ? rel(join(dir, docs)) : null,
    storyTitle,
    parts: {
      stories: stories.length > 0,
      test: files.some((file) => /(?<!\.visual)\.test\.tsx?$/.test(file)),
      visualTest: files.some((file) => file.endsWith('.visual.test.tsx')),
      docs: Boolean(docs),
    },
  };
}
const componentsDir = join(root, 'src/components');
const folders = new Map(
  readdirSync(componentsDir)
    .sort()
    .map((name) => [name.toLowerCase(), scan(join(componentsDir, name), name)])
);

// Export statements of a module: `export { a, b as c } from 'x'`,
// `export * from 'x'`, and local declarations.
function exportsOf(file) {
  const code = read(file).replace(/^\s*\/\/.*$/gm, '');
  const statements = [];
  const named = /export\s+(type\s+)?\{([^}]*)\}\s*from\s*'([^']+)'/g;
  for (const [, type, list, from] of code.matchAll(named)) {
    const names = list
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [original, alias] = item
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/);
        const isType = Boolean(type) || item.startsWith('type ');
        return { name: alias ?? original, original, isType };
      });
    statements.push({ from, names });
  }
  for (const [, from] of code.matchAll(/export\s+\*\s+from\s+'([^']+)'/g)) {
    statements.push({ from, star: true });
  }
  const declared =
    /export\s+(?:async\s+)?(function|const|let|class|type|interface|enum)\s+(\w+)/g;
  const names = [...code.matchAll(declared)].map(([, kind, name]) => ({
    name,
    original: name,
    isType: kind === 'type' || kind === 'interface',
  }));
  if (names.length > 0) statements.push({ from: null, names });
  return statements;
}

const localPath = (from, file) => {
  const path = join(dirname(file), from).replace(/\.js$/, '.ts');
  return existsSync(path) ? path : path.replace(/\.ts$/, '.tsx');
};

// Every name a local module exports, through its own `export *` chain, and
// whether any module on the way is a client module.
function collect(file) {
  if (!existsSync(file)) {
    problems.push(`export points nowhere: ${rel(file)}`);
    return { names: [], runtime: 'server' };
  }
  let client = usesClient(file);
  const names = [];
  for (const { from, star, names: listed } of exportsOf(file)) {
    const target = from?.startsWith('.') && localPath(from, file);
    if (star && target) {
      const inner = collect(target);
      names.push(...inner.names);
      client ||= inner.runtime === 'client';
    } else if (listed) {
      names.push(...listed);
      client ||= Boolean(target) && existsSync(target) && usesClient(target);
    }
  }
  return { names, runtime: client ? 'client' : 'server' };
}

// Afframe and extras families (one per local module src/index.ts re-exports)
// and subpath entries.
const families = [];
function family(name, info, fields, names) {
  let entry = families.find((other) => other.name === name);
  if (!entry) {
    entry = {
      name,
      kind: 'component',
      source: info.source ?? null,
      import: ['@afframe/ui'],
      runtime: 'client',
      folder: info.folder ?? null,
      docs: info.docs ?? null,
      storyTitle: info.storyTitle ?? null,
      status: 'stable',
      exports: [],
      types: [],
      ...(info.owned && { parts: info.parts }),
      ...fields,
    };
    families.push(entry);
  }
  for (const { name: exported, isType } of names) {
    (isType ? entry.types : entry.exports).push(exported);
  }
}

// Carbon, IBM Products and Labs: one entry per exported value, types left out.
const upstream = [];
async function listUpstream(names, source, runtime, specifier) {
  const module = await import(specifier);
  for (const { name, original } of names.filter((item) => !item.isType)) {
    // Docs only from a folder of exactly the export's name.
    const docs = folders.get(baseName(name).toLowerCase())?.docs;
    // A wrapper module already exports the alias; a package, the original.
    const value = module[specifier.startsWith('file:') ? name : original];
    if (value === undefined) {
      problems.push(`${name}: no run-time value in ${specifier}`);
    }
    upstream.push({
      name,
      kind: kindOf(name, value),
      source,
      import: ['@afframe/ui'],
      runtime,
      status: statusOf(original),
      ...(docs && { docs }),
    });
  }
}
function packageRuntime(specifier) {
  const parts = specifier.split('/');
  const name = parts.slice(0, specifier.startsWith('@') ? 2 : 1).join('/');
  const dir = join(root, 'node_modules', name);
  const entry =
    specifier === name
      ? JSON.parse(read(join(dir, 'package.json'))).module
      : specifier.slice(name.length + 1);
  return usesClient(join(dir, entry)) ? 'client' : 'server';
}
const packageSource = (from) =>
  from.startsWith('@carbon-labs/')
    ? 'labs'
    : from.startsWith('@carbon/ibm-products')
      ? 'ibm-products'
      : 'carbon';

const index = join(root, 'src/index.ts');
for (const { from, star, names } of exportsOf(index)) {
  if (!from) {
    for (const { name } of names.filter((item) => !item.isType)) {
      problems.push(`src/index.ts declares ${name}, which is not listed`);
    }
    continue;
  }
  if (!from.startsWith('.')) {
    await listUpstream(names, packageSource(from), packageRuntime(from), from);
    continue;
  }
  const file = localPath(from, index);
  const { names: collected, runtime } = collect(file);
  const dir = rel(dirname(file));
  const component = /^src\/components\/(\w+)$/.exec(dir)?.[1];
  if (component) {
    family(
      component,
      folders.get(component.toLowerCase()) ?? {},
      { runtime },
      collected
    );
  } else if (dir === 'src/labs') {
    await listUpstream(collected, 'labs', runtime, pathToFileURL(file).href);
  } else {
    const name =
      dir === 'src' ? 'messages' : star ? dir.slice(4) : 'AfframeProvider';
    const kind = star ? (name === 'theme' ? 'hook' : 'util') : 'provider';
    const info =
      dir === 'src' ? {} : { ...scan(join(root, dir), name), owned: false };
    const folder = dir === 'src' ? rel(file) : dir;
    family(
      name,
      info,
      { kind, source: 'afframe', runtime, folder },
      star ? collected : names
    );
  }
}

// Subpath entries from package.json `exports`: a module that already backs a
// family gains the import path, any other is an entry of its own.
// `./package.json` is metadata for tools, not an entry.
const pkg = JSON.parse(read(join(root, 'package.json')));
const subpaths = Object.keys(pkg.exports).filter(
  (key) => key !== '.' && key !== './package.json'
);
for (const subpath of subpaths) {
  const name = subpath.slice(2);
  const importPath = `@afframe/ui/${name}`;
  const owner = families.find((entry) => entry.folder === `src/${name}`);
  const file = [`src/${name}.ts`, `src/${name}/index.ts`]
    .map((path) => join(root, path))
    .find(existsSync);
  if (owner) owner.import.push(importPath);
  else if (!file && !name.endsWith('.css')) {
    problems.push(`export points nowhere: ${subpath}`);
  } else {
    family(
      name,
      { ...folders.get(name), owned: false },
      {
        kind: 'foundation',
        source: 'carbon',
        import: [importPath],
        runtime: file ? collect(file).runtime : 'server',
      },
      []
    );
  }
}

// Afframe folders need every part and an export; every listed path must exist.
for (const entry of families) {
  for (const [part, present] of Object.entries(entry.parts ?? {})) {
    if (!present) problems.push(`${entry.folder}: no ${part}`);
  }
}
for (const entry of [...families, ...upstream]) {
  for (const path of [entry.folder, entry.docs]) {
    if (path && !existsSync(join(root, path))) {
      problems.push(`${entry.name}: ${path} does not exist`);
    }
  }
}
for (const { folder, owned } of folders.values()) {
  if (owned && !families.some((entry) => entry.folder === folder)) {
    problems.push(`${folder}: Afframe folder without an export`);
  }
}

const table = (header, rows) => [
  `| ${header.join(' | ')} |`,
  `| ${header.map(() => '---').join(' | ')} |`,
  ...rows.map((row) => `| ${row.join(' | ')} |`),
];
const link = (docs) => (docs ? `[page](../${docs})` : '');
const markdown = [
  '# Registry',
  '',
  'Every public export of `@afframe/ui`. Generated by `pnpm registry` from `src/index.ts`, the subpath entries and `src/components`; `pnpm registry --check` (part of `pnpm preflight`) fails when it is out of date. The full data is in [registry.json](registry.json).',
  '',
  '## Afframe families and subpaths',
  '',
  'One entry per Afframe or extras module and per subpath; the JSON lists its exports and types. Afframe parts: stories, test, visual test, docs page.',
  '',
  ...table(
    ['Family', 'Kind', 'Source', 'Import', 'Runtime', 'Docs', 'Afframe parts'],
    families.map((entry) => [
      entry.name,
      entry.kind,
      entry.source ?? '',
      entry.import.map((path) => `\`${path}\``).join(', '),
      entry.runtime,
      link(entry.docs),
      Object.values(entry.parts ?? {})
        .map((present) => (present ? 'yes' : 'no'))
        .join(', '),
    ])
  ),
  '',
  '## Carbon, IBM Products and Labs',
  '',
  'One entry per exported value, imported from `@afframe/ui`; types are left out. Kind comes from the value: hook for a `use` name, component when React can render it, namespace for an object of components, else util. Docs links only a folder of exactly the export name.',
  '',
  ...table(
    ['Export', 'Kind', 'Source', 'Runtime', 'Status', 'Docs'],
    upstream.map((entry) => [
      entry.name,
      entry.kind,
      entry.source,
      entry.runtime,
      entry.status,
      link(entry.docs),
    ])
  ),
  '',
].join('\n');

const outputs = {
  'docs/registry.json': JSON.stringify({ families, upstream }, null, 2),
  'docs/registry.md': markdown,
};
for (const [path, text] of Object.entries(outputs)) {
  const file = join(root, path);
  const options = await resolveConfig(file);
  const formatted = await format(text, { ...options, filepath: file });
  if (!check) writeFileSync(file, formatted);
  else if (!existsSync(file) || read(file) !== formatted) {
    problems.push(`${path} is out of date: run pnpm registry`);
  }
}

if (problems.length > 0) {
  console.error(`registry failed:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(
  `registry ${check ? 'checked' : 'written'}: ${families.length} families, ${upstream.length} upstream exports`
);
