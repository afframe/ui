// Checks that the API tables of re-exported Carbon and IBM Products components
// are filled. They come from Storybook's experimental docgen server, which a
// Storybook update can break without failing the build. Run after
// `build:storybook`.
import { existsSync, readFileSync } from 'node:fs';

const dir = 'storybook-static/services/core/docgen';
// Component id from the story title, and one prop each table must list.
const samples = [
  ['components-button', 'kind'], // Carbon
  ['components-datatable-basic', 'rows'], // Carbon
  ['components-tearsheet', 'onClose'], // IBM Products
  ['components-sidepanel', 'title'], // IBM Products
];

if (!existsSync(dir)) {
  console.error(
    `check:docgen failed: ${dir} not found. Run pnpm build:storybook first; if it ran, the docgen server is off or writes elsewhere.`
  );
  process.exit(1);
}

const failures = samples.flatMap(([id, prop]) => {
  const file = `${dir}/${id}.json`;
  const entry = existsSync(file)
    ? JSON.parse(readFileSync(file, 'utf8')).components?.[id]
    : undefined;
  if (entry?.error) return [`${id}: ${entry.error.message}`];
  return entry?.argTypes?.[prop] ? [] : [`${id}: no '${prop}' prop in ${file}`];
});

if (failures.length > 0) {
  console.error(`check:docgen failed:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`check:docgen: ${samples.length} API tables filled`);
