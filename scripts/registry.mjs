// Writes docs/registry.json and docs/registry.md from src/index.ts, the
// subpath entries and a scan of src/components. `--check` writes nothing and
// fails on drift, on an Afframe folder without stories, test, visual test or
// docs page, on a wrapper without an `afframe` story, test or docs page, on
// an export whose module or docs page does not exist, and on an upstream
// export with no docs page that `noDocsPage` does not list.
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
    : name.startsWith('preview_')
      ? 'preview'
      : 'stable';
// Carbon's preview names start with `preview__` or `preview_`.
const baseName = (name) => name.replace(/^(?:[a-zA-Z]+__|preview_)/, '');

// Kind from the loaded value, not the name: a context or constant object is
// a util even when capitalised; an object of components is a namespace.
const renderable = ['forward_ref', 'memo', 'lazy'].map((type) =>
  Symbol.for(`react.${type}`)
);
const isComponent = (name, value) =>
  (typeof value === 'function' && /^[A-Z]/.test(baseName(name))) ||
  renderable.includes(value?.$$typeof);
// A plain class (AddSelectData) is not a component; a React class component is.
const isPlainClass = (value) =>
  typeof value === 'function' &&
  /^class\b/.test(Function.prototype.toString.call(value)) &&
  !value.prototype?.isReactComponent;
const kindOf = (name, value) =>
  /^use[A-Z]/.test(baseName(name))
    ? 'hook'
    : !isPlainClass(value) && isComponent(name, value)
      ? 'component'
      : typeof value === 'object' &&
          Object.keys(value ?? {}).length > 0 &&
          Object.entries(value).every(([key, part]) => isComponent(key, part))
        ? 'namespace'
        : 'util';

// A folder's docs page, story title, source tag and Afframe parts.
function scan(dir, name) {
  const files = readdirSync(dir).sort();
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
  // A page with no stories names itself in <Meta title="...">.
  storyTitle ??= docs
    ? (/<Meta\s[^>]*title="([^"]+)"/.exec(read(join(dir, docs)))?.[1] ?? null)
    : null;
  const tags = code.map((text) => /^\s+tags: \[([^\]]*)\]/m.exec(text)?.[1]);
  const source = ['afframe', 'extras', 'carbon', 'ibm-products', 'labs'].find(
    (tag) => tags.join(',').includes(`'${tag}'`)
  );
  // An Afframe wrapper of an upstream component keeps the upstream folder and
  // look, so it needs an `afframe` story with a play test, not a visual test.
  const wrapper =
    ['carbon', 'ibm-products', 'labs'].includes(source) &&
    files.includes('index.ts');
  return {
    folder: rel(dir),
    source,
    owned: source === 'afframe' && files.includes('index.ts'),
    wrapper,
    ...(wrapper && {
      wrapperParts: {
        // The play test must sit in the same story export as the tag.
        afframeStory: code.some((text) =>
          /tags: \['afframe'\](?:(?!\nexport )[\s\S])*?\bplay\b/.test(text)
        ),
        test: files.some((file) => /(?<!\.visual)\.test\.tsx?$/.test(file)),
        docs: Boolean(docs),
      },
    }),
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

// Docs pages of exports without a folder of their own: a stories meta's
// `component` and `subcomponents` point to the page the stories file uses;
// a folder's main stories file wins over the others.
// Stories in subfolders (`DataTable/stories/expansion/`) count for their
// component folder.
const docsByName = new Map();
// The title of the stories file that gave an export its page.
const titleByName = new Map();
const storyFiles = [];
for (const name of readdirSync(componentsDir).sort()) {
  const dir = join(componentsDir, name);
  for (const file of readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith('.stories.tsx'))
    .sort()) {
    storyFiles.push({ dir, file, main: file === `${name}.stories.tsx` });
  }
}
storyFiles.sort((a, b) => Number(b.main) - Number(a.main));
for (const pass of ['component', 'subcomponents']) {
  for (const { dir, file } of storyFiles) {
    const code = read(join(dir, file));
    const page = /import\s+\w+\s+from\s+'(\.\.?\/[^']+\.mdx)'/.exec(code)?.[1];
    const docs = page
      ? rel(join(dir, dirname(file), page))
      : folders.get(rel(dir).split('/').pop().toLowerCase())?.docs;
    if (!docs) continue;
    // A stories file can render a namespace member under a local name
    // (`const { DatePicker } = preview__DatePicker`); its title still names
    // the export.
    const names =
      pass === 'component'
        ? [
            /^\s+component:\s*(\w+)/m.exec(code)?.[1],
            /title:\s*'[^']*\/(\w+)'/.exec(code)?.[1],
          ]
        : (/^\s+subcomponents:\s*\{([^}]*)\}/m.exec(code)?.[1] ?? '')
            .split(',')
            .map((item) => item.split(':')[0].trim());
    for (const name of names.filter(Boolean)) {
      const current = docsByName.get(name);
      // Of several pages, the one whose folder starts the export name wins
      // (MenuItem: Menu, not ComboButton).
      const folder = (path) => path?.split('/').at(-2) ?? '';
      if (
        !current ||
        (name.startsWith(folder(docs)) && !name.startsWith(folder(current)))
      ) {
        docsByName.set(name, docs);
        titleByName.set(name, /title:\s*'([^']*\/[^']*)'/.exec(code)?.[1]);
      }
    }
  }
}
// The Storybook title of each docs page: a page names itself in
// <Meta title="...">, else it takes the titles of the stories files that use
// it (their shared path when they differ); a stories file without a page is
// its own autodocs page.
const titlesOfPage = new Map();
const storyTitles = new Set(
  readdirSync(join(root, 'src'), { recursive: true })
    .filter((file) => file.endsWith('.stories.tsx'))
    .map(
      (file) =>
        /title:\s*'([^']*\/[^']*)'/.exec(read(join(root, 'src', file)))?.[1]
    )
);
for (const { dir, file } of storyFiles) {
  const code = read(join(dir, file));
  const title = /title:\s*'([^']*\/[^']*)'/.exec(code)?.[1];
  const page = /import\s+\w+\s+from\s+'(\.\.?\/[^']+\.mdx)'/.exec(code)?.[1];
  const path = rel(join(dir, page ? join(dirname(file), page) : file));
  if (title) titlesOfPage.set(path, [...(titlesOfPage.get(path) ?? []), title]);
}
const ownTitle = (page) =>
  page.endsWith('.mdx')
    ? (/<Meta\s[^>]*title="([^"]+)"/.exec(read(join(root, page)))?.[1] ?? null)
    : null;
function titleOf(page) {
  if (!page) return null;
  const own = ownTitle(page);
  if (own) return own;
  const parts = (titlesOfPage.get(page) ?? []).map((title) => title.split('/'));
  if (parts.length === 0) return null;
  return (
    parts[0]
      .filter((part, i) => parts.every((other) => other[i] === part))
      .join('/') || null
  );
}
// A page shared by stories files with different titles (UIShell.mdx) takes,
// for each export, the title of the stories file that named it, unless the
// shared title ends in a component folder (`Components/DataTable`).
function titleFor(name, docs) {
  const shared = titleOf(docs);
  if (ownTitle(docs) || folders.has(shared?.split('/').at(-1).toLowerCase())) {
    return shared;
  }
  return (
    [name, baseName(name)]
      .filter((key) => docsByName.get(key) === docs)
      .map((key) => titleByName.get(key))
      .find(Boolean) ?? shared
  );
}

// Exports documented on another export's page.
const docsAliases = {
  ColumnHang: 'Grid/Grid.mdx',
  GridSettings: 'Grid/Grid.mdx',
  HStack: 'Stack/Stack.mdx',
  VStack: 'Stack/Stack.mdx',
  useLayer: 'Layer/Layer.mdx',
  useIdPrefix: 'IdPrefix/IdPrefix.mdx',
  useFeatureFlag: 'FeatureFlags/FeatureFlags.mdx',
  useFeatureFlags: 'FeatureFlags/FeatureFlags.mdx',
  PrefixContext: 'useCarbonPrefix/useCarbonPrefix.mdx',
  useTheme: 'Theme/Theme.mdx',
  createOverflowHandler: 'OverflowHandler/OverflowHandler.mdx',
  StepProvider: 'StepFlow/StepFlow.mdx',
  useStepContext: 'StepFlow/StepFlow.mdx',
  usePrefersDarkScheme: 'Theme/Theme.mdx',
  ThemeContext: 'Theme/Theme.mdx',
  useThemeSetting: 'ThemeSettings/ThemeSettings.mdx',
  ThemeSetDropdown: 'ThemeSettings/ThemeSettings.mdx',
  FluidDatePickerInput: 'FluidDatePicker/FluidDatePicker.mdx',
  DataTableSkeleton: 'DataTable/DataTable.mdx',
  IconSkeleton: 'SkeletonIcon/SkeletonIcon.mdx',
  NotificationButton: 'Notification/Notification.mdx',
  NotificationActionButton: 'Notification/Notification.mdx',
  ErrorBoundaryContext: 'ErrorBoundary/ErrorBoundary.mdx',
  AILabelContent: 'AILabel/AILabel.mdx',
  AILabelActions: 'AILabel/AILabel.mdx',
  GuidebannerElement: 'Guidebanner/Guidebanner.mdx',
  GuidebannerElementButton: 'Guidebanner/Guidebanner.mdx',
  GuidebannerElementLink: 'Guidebanner/Guidebanner.mdx',
  WelcomeInterstitial: 'FirstTimeOrientation/FirstTimeOrientation.mdx',
  PersonalizationInterstitial: 'FirstTimeOrientation/FirstTimeOrientation.mdx',
  ToggleSkeleton: 'Toggle/Toggle.mdx',
  TableDecoratorRow: 'DataTable/DataTable.mdx',
  StructuredListSkeleton: 'StructuredList/StructuredList.mdx',
  DismissibleTag: 'Tag/Tag.mdx',
  OperationalTag: 'Tag/Tag.mdx',
  TagSkeleton: 'Tag/Tag.mdx',
  CodeSnippetSkeleton: 'CodeSnippet/CodeSnippet.mdx',
  ModalPresence: 'Modal/Modal.featureflag.mdx',
  withModalPresence: 'Modal/Modal.featureflag.mdx',
  ComposedModalPresence: 'ComposedModal/ComposedModal.featureflag.mdx',
  withComposedModalPresence: 'ComposedModal/ComposedModal.featureflag.mdx',
  AddSelectData: 'AddSelect/AddSelect.mdx',
  previewCandidate__InlineTipButton: 'InlineTip/InlineTip.mdx',
  previewCandidate__InlineTipLink: 'InlineTip/InlineTip.mdx',
  SIDE_NAV_TYPE: 'UIShellLabs/SideNav.mdx',
  // ChatButton has no .mdx: its docs page is the autodocs page of its stories.
  preview__ChatButton: 'ChatButton/ChatButton.stories.tsx',
  preview__ChatButtonSkeleton: 'ChatButton/ChatButton.stories.tsx',
  // Lists of a prop's values, on the page with that prop's section.
  ButtonKinds: 'Button/Button.mdx',
  ButtonSizes: 'Button/Button.mdx',
  ButtonTooltipAlignments: 'Button/Button.mdx',
  ButtonTooltipPositions: 'Button/Button.mdx',
  IconButtonKinds: 'IconButton/IconButton.mdx',
};
// Upstream exports no page documents or shows; any other export without a
// docs link fails the check.
const noDocsPage = {
  // Carbon parts with no Carbon story or docs section of their own.
  PrimaryButton: 'Button with kind primary',
  SecondaryButton: 'Button with kind secondary',
  DangerButton: 'Button with kind danger',
  Copy: 'the base of CopyButton',
  FormItem: 'the wrapper inside form fields',
  FormContext: 'the context of Form',
  ControlledPasswordInput: 'PasswordInput with outside visibility state',
  InlineCheckbox: 'the checkbox inside DataTable selection',
  ToggleSmallSkeleton: 'the skeleton of the small Toggle',
  Filename: 'the status icon of FileUploaderItem',
  validateNumberSeparators: 'the separator check inside NumberInput',
  TableActionList: 'the action list inside TableBatchActions',
  SideNavDetails: 'a part of the Carbon SideNav',
  SideNavFooter: 'a part of the Carbon SideNav',
  SideNavHeader: 'a part of the Carbon SideNav',
  SideNavIcon: 'a part of the Carbon SideNav',
  SideNavItem: 'a part of the Carbon SideNav',
  SideNavLinkText: 'a part of the Carbon SideNav',
  SideNavSwitcher: 'a part of the Carbon SideNav',
  // IBM Products and Labs.
  BEACON_KIND: 'values of the CoachmarkBeacon kind prop, no section for it',
  ConditionBuilderContext: 'the context of ConditionBuilder',
  getEmptyState: 'returns an empty ConditionBuilder state',
  usePrefix: 'IBM Products hook with no IBM page',
  SideNavLinkPopover: 'a part of the Labs SideNav',
  SharkFinIcon: 'an icon of the Labs shell',
  themeSets: 'the theme set values of ThemeSetDropdown',
};
for (const [name, page] of Object.entries(docsAliases)) {
  if (!docsByName.has(name)) docsByName.set(name, `src/components/${page}`);
}
// A prefixed name takes its own page before the folder of its base name
// (preview__DatePicker: DatePickerV2.mdx, not DatePicker.mdx).
const docsOf = (name) =>
  (name !== baseName(name) && docsByName.get(name)) ||
  (folders.get(baseName(name).toLowerCase())?.docs ??
    docsByName.get(name) ??
    docsByName.get(baseName(name)));

// Export statements of a module: `export { a, b as c } from 'x'`,
// `export * from 'x'`, `export * as a from 'x'`, and local declarations.
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
        return { name: alias ?? original, original, isType, from };
      });
    statements.push({ from, names });
  }
  for (const [, from] of code.matchAll(/export\s+\*\s+from\s+'([^']+)'/g)) {
    statements.push({ from, star: true });
  }
  const namespaces = /export\s+\*\s+as\s+(\w+)\s+from\s+'([^']+)'/g;
  for (const [, name, from] of code.matchAll(namespaces)) {
    statements.push({ from, names: [{ name, original: name, isType: false }] });
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
      section: null,
      family: null,
      status: 'stable',
      exports: [],
      types: [],
      ...(info.owned && { parts: info.parts }),
      ...(info.wrapper && { wrapper: true, parts: info.wrapperParts }),
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
  for (const { name, original, from } of names.filter((item) => !item.isType)) {
    const docs = docsOf(name);
    // The name upstream docs and the Carbon MCP use, when Afframe renames it.
    const upstreamPackage = (
      from && !from.startsWith('.') ? from : specifier.replace(/^file:.*/, '')
    ).match(/^(?:@[^/]+\/)?[^/]*/)[0];
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
      // A package index re-exports a default under its public name.
      ...(original !== name &&
        original !== 'default' && {
          upstream: { package: upstreamPackage, name: original },
        }),
      ...(docs && {
        docs,
        storyTitle: titleFor(name, docs),
        section: null,
        family: null,
      }),
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
    const info = folders.get(component.toLowerCase()) ?? {};
    family(component, info, { runtime }, collected);
  } else if (dir === 'src/labs') {
    await listUpstream(collected, 'labs', runtime, pathToFileURL(file).href);
  } else if (dir === 'src/utilities') {
    await listUpstream(collected, 'carbon', runtime, pathToFileURL(file).href);
  } else if (dir === 'src/ibm-products') {
    await listUpstream(
      collected,
      'ibm-products',
      runtime,
      pathToFileURL(file).href
    );
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
for (const entry of upstream) {
  if (!entry.docs && !(entry.name in noDocsPage)) {
    problems.push(
      `${entry.name}: no docs page; link one or add it to noDocsPage`
    );
  }
  if (entry.docs && entry.name in noDocsPage) {
    problems.push(`${entry.name}: has a docs page; remove it from noDocsPage`);
  }
}
for (const name of Object.keys(noDocsPage)) {
  if (!upstream.some((entry) => entry.name === name)) {
    problems.push(`${name}: in noDocsPage but not an upstream export`);
  }
}
for (const [name, page] of Object.entries(docsAliases)) {
  const entry = upstream.find((other) => other.name === name);
  if (entry?.docs !== `src/components/${page}`) {
    problems.push(`${name}: docsAliases entry is not its docs link; remove it`);
  }
}
for (const { folder, owned } of folders.values()) {
  if (owned && !families.some((entry) => entry.folder === folder)) {
    problems.push(`${folder}: Afframe folder without an export`);
  }
}

// Grouping comes from the Storybook title only (ADR 0019): its first part is
// the section; the family is the subfolder between section and page. A part
// that names an export is the component (`Components/DataTable/
// Basic`, `Components/Modal/Feature Flags`), and so is the end of a page
// title; a title that is only a folder (`Components/Charts`) is a family.
const pageNames = new Set([
  ...upstream.map((entry) => entry.name),
  ...families.flatMap((entry) => entry.exports),
]);
const subPages = ['Feature Flags', 'Examples', 'Docs'];
for (const entry of [...families, ...upstream]) {
  if (!entry.storyTitle) continue;
  const parts = entry.storyTitle.split('/');
  const named = parts.findIndex((part, i) => i > 0 && pageNames.has(part));
  const sub = parts.findIndex((part, i) => i > 1 && subPages.includes(part));
  const path = sub < 0 ? parts : parts.slice(0, sub);
  const family =
    named > 0
      ? parts.slice(1, named)
      : storyTitles.has(path.join('/')) ||
          ownTitle(entry.docs ?? '') === path.join('/')
        ? path.slice(1, -1)
        : path.slice(1);
  entry.section = parts[0];
  entry.family = family.join('/') || null;
}

// Entries in sidebar order: Storybook's own sort, read from
// .storybook/preview.tsx. Storybook requires storySort inline and free of
// outside references, so it cannot be imported; its source is evaluated here.
// Entries without a title go last; ties keep the src/index.ts order.
const sortSource = /storySort: (\(a, b\) => \{[\s\S]*?\n {6}\}),\n/.exec(
  read(join(root, '.storybook/preview.tsx'))
)?.[1];
if (!sortSource) {
  throw new Error(
    'registry: no storySort in .storybook/preview.tsx; expected `storySort: (a, b) => {` closed by `},` at 6 spaces'
  );
}
const storySort = new Function(`return ${sortSource}`)();
const bySidebar = (a, b) =>
  !a.storyTitle || !b.storyTitle
    ? Number(!a.storyTitle) - Number(!b.storyTitle)
    : // storySort reads only `title` of Storybook's index entries.
      storySort({ title: a.storyTitle }, { title: b.storyTitle });
families.sort(bySidebar);
upstream.sort(bySidebar);

const sourceLabel = (entry) =>
  entry.wrapper ? `${entry.source} wrapper` : (entry.source ?? '');
const ownership =
  "Afframe-owned code has source `afframe` (Afframe components and helpers), `extras` (an Afframe module around another IBM or charting library, exported under that library's names) or `<source> wrapper` (Afframe code around an upstream component that keeps its look, such as `carbon wrapper`). Plain `carbon`: a Carbon subpath or stylesheet. Every other export is the upstream component or value, a few under an Afframe name (`upstream` in registry.json, Renamed exports in the agent guide).";
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
  'Grouping follows Storybook only (ADR 0019): `storyTitle` is the Storybook title of the docs page, `section` its first part, `family` the subfolder between section and page (none when the page sits in the section). Both tables are in sidebar order; entries without a docs page come last.',
  '',
  '## Afframe families and subpaths',
  '',
  'One entry per Afframe or extras module and per subpath; the JSON lists its exports and types. ' +
    ownership +
    ' Afframe parts: stories, test, visual test, docs page; for a wrapper of an upstream component (source marked `wrapper`): an `afframe` story with a play test, test, docs page.',
  '',
  ...table(
    [
      'Family',
      'Storybook',
      'Kind',
      'Source',
      'Import',
      'Runtime',
      'Docs',
      'Afframe parts',
    ],
    families.map((entry) => [
      entry.name,
      entry.storyTitle ?? '',
      entry.kind,
      sourceLabel(entry),
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
  'One entry per exported value, imported from `@afframe/ui`; types are left out. Kind comes from the value: hook for a `use` name, component when React can render it, namespace for an object of components, else util. Docs links the folder named after the export, else the page whose stories name it as `component`, in `subcomponents` or as the last part of the title, else a page named in the alias map in `scripts/registry.mjs`; a prefixed export such as `preview__DatePicker` takes its own page before the folder of its base name. An export without a link is one no page documents, listed with its reason in `noDocsPage` in the same script.',
  '',
  ...table(
    ['Export', 'Storybook', 'Kind', 'Source', 'Runtime', 'Status', 'Docs'],
    upstream.map((entry) => [
      entry.name,
      entry.storyTitle ?? '',
      entry.kind,
      entry.source,
      entry.runtime,
      entry.status,
      link(entry.docs),
    ])
  ),
  '',
].join('\n');

// The agent guide ships as dist/agents.md: the consumer rules quoted from the
// guide, so they live in one file, and a compact export index.
const guide = read(join(root, 'docs/guides/consuming.md'));
const sectionOf = (title) => {
  const match = new RegExp(`^## \\d+\\. ${title}\\n[\\s\\S]*?(?=^## )`, 'm');
  const text = match.exec(guide)?.[0];
  if (!text) problems.push(`docs/guides/consuming.md: no section "${title}"`);
  return text ?? '';
};
const codeList = (list) => list.map((name) => `\`${name}\``).join(', ');
const bySource = (source) => upstream.filter((e) => e.source === source);
const agents = [
  '# @afframe/ui for agents',
  '',
  'Generated by `pnpm registry` from `docs/guides/consuming.md` and the package exports; do not edit. It matches the installed version. Props and their docs: the `.d.ts` files next to this one. Paths below and ADRs (`docs/decisions/`) are in the afframe/ui repo: `https://github.com/afframe/ui/blob/v<version>/<path>`, with `<version>` from the `package.json` one folder up.',
  '',
  sectionOf('Wire it once'),
  sectionOf('Use it'),
  '## Renamed exports',
  '',
  'Upstream docs and the Carbon MCP use the upstream name. Import the Afframe name from `@afframe/ui`.',
  '',
  ...table(
    ['Afframe name', 'Upstream name', 'Upstream package'],
    upstream
      .filter((entry) => entry.upstream)
      .map((entry) => [
        `\`${entry.name}\``,
        `\`${entry.upstream.name}\``,
        `\`${entry.upstream.package}\``,
      ])
  ),
  '',
  '## Afframe families and subpaths',
  '',
  ownership,
  '',
  // A list, not a table: Prettier pads every table row to the widest cell.
  ...families.map(
    (entry) =>
      `- **${entry.name}** (${sourceLabel(entry)}, ${entry.kind}, ${entry.runtime}, ${codeList(entry.import)})` +
      (entry.exports.length > 0 ? `: ${codeList(entry.exports)}` : '')
  ),
  '',
  '## Carbon, IBM Products and Labs',
  '',
  'Every value is imported from `@afframe/ui`. Server-safe ones: ' +
    `${codeList(upstream.filter((e) => e.runtime === 'server').map((e) => e.name))}; the others are client values.`,
  '',
  ...[
    ['Carbon', 'carbon'],
    ['IBM Products', 'ibm-products'],
    ['Labs', 'labs'],
  ].flatMap(([title, source]) => [
    `${title}: ${codeList(bySource(source).map((entry) => entry.name))}.`,
    '',
  ]),
].join('\n');

const outputs = {
  'docs/registry.json': JSON.stringify({ families, upstream }, null, 2),
  'docs/registry.md': markdown,
  'docs/agent-guide.md': agents,
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
