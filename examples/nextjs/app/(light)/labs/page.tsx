import {
  TextInput,
  Toc,
  TocItem,
  TocList,
  TocSection,
  TocSections,
  TrialCountdown,
} from '@afframe/ui';

// The control route for scripts/check-example.mjs: it renders Labs UI Shell
// and What's New parts, so their JavaScript must ship here and only here.
export default function LabsPage() {
  return (
    <main style={{ padding: 'var(--cds-spacing-07)' }}>
      <h1>Labs</h1>
      <TextInput id="team" labelText="Team" />
      <TrialCountdown count={14} />
      <Toc>
        <TocList>
          <TocItem>Overview</TocItem>
        </TocList>
        <TocSections tabIndex={0}>
          <TocSection as="section">
            <h2>Overview</h2>
            <p>What changed in this release.</p>
          </TocSection>
        </TocSections>
      </Toc>
    </main>
  );
}
