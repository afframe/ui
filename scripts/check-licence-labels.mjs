// Checks the output of `reuse lint --json` (stdin, or a file path argument):
// the project is REUSE compliant, every src/**/*.mdx page takes its copyright
// and licence from its own header (never the REUSE.toml fallback), and the
// page's <SourceLabel name="..."> agrees with that licence.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const fail = (problems) => {
  console.error(`check:licences failed:\n${problems.join('\n')}`);
  process.exit(1);
};

let report;
try {
  report = JSON.parse(readFileSync(process.argv[2] ?? 0, 'utf8'));
} catch (error) {
  fail([
    `cannot read reuse lint --json output: ${error.message} (is reuse installed at the version pinned in scripts/ci/toolbox/Dockerfile?)`,
  ]);
}

const problems = [];
if (report.summary?.compliant !== true) {
  problems.push('reuse lint: project is not compliant');
}
for (const [key, value] of Object.entries(report.non_compliant ?? {})) {
  const entries = Array.isArray(value) ? value : Object.keys(value ?? {});
  if (entries.length > 0)
    problems.push(`reuse lint ${key}: ${entries.join(', ')}`);
}

const ibm = { licences: ['Apache-2.0'], copyright: 'IBM Corp.' };
const expected = {
  carbon: ibm,
  'ibm-products': ibm,
  labs: ibm,
  afframe: { licences: ['PolyForm-Noncommercial-1.0.0'] },
};

const reported = new Map((report.files ?? []).map((file) => [file.path, file]));
const pages = execFileSync(
  'git',
  ['ls-files', '-co', '--exclude-standard', 'src/*.mdx'],
  { encoding: 'utf8' }
)
  .split('\n')
  .filter(Boolean);

for (const page of pages) {
  const file = reported.get(page);
  if (!file) {
    problems.push(`${page}: missing from reuse lint output`);
    continue;
  }
  const entries = [
    ...(file.copyrights ?? []),
    ...(file.spdx_expressions ?? []),
  ];
  const sources = new Set(
    entries
      .map((entry) => entry.source_type)
      .filter((type) => type !== 'file-header' && type !== 'dot-license')
  );
  if (sources.size > 0) {
    problems.push(`${page}: licence info from ${[...sources].join(', ')}`);
  }

  const text = readFileSync(page, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (!/^\/\/ (SPDX-|Modified by Afframe)/.test(line)) return;
    let start = index;
    while (start > 0 && lines[start - 1].trim() !== '') start -= 1;
    if (!lines[start].startsWith('import ')) {
      problems.push(
        `${page}:${index + 1}: header line outside the import block`
      );
    }
  });

  const label = /<SourceLabel\s+name="([^"]+)"/.exec(text)?.[1];
  const rule = expected[label];
  if (label === 'extras') continue;
  if (!rule) {
    problems.push(`${page}: unknown or missing SourceLabel "${label}"`);
    continue;
  }
  const licences = (file.spdx_expressions ?? []).map((entry) => entry.value);
  if (licences.join(' ') !== rule.licences.join(' ')) {
    problems.push(
      `${page}: label "${label}" needs ${rule.licences.join(', ')}, has ${licences.join(', ') || 'none'}`
    );
  }
  if (
    rule.copyright &&
    !(file.copyrights ?? []).some((entry) =>
      entry.value.includes(rule.copyright)
    )
  ) {
    problems.push(
      `${page}: label "${label}" needs a copyright by ${rule.copyright}`
    );
  }
}

if (pages.length === 0) problems.push('no src/**/*.mdx pages found');
if (problems.length > 0) fail(problems);
console.log(`check:licences passed: ${pages.length} pages`);
