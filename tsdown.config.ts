import { defineConfig } from 'tsdown';

// JavaScript only: per-file ESM in dist/, mirroring src/. Declarations come
// from tsc (tsconfig.build.json), styles.css from Sass (ADR 0010). tsdown
// cleans dist/ first, so `build` runs it before the other steps.
export default defineConfig({
  // The 'use client' family modules are entries too: as plain re-export
  // modules they would otherwise be inlined into dist/index.js, and their
  // directive with them.
  entry: [
    'src/index.ts',
    'src/icons.ts',
    'src/pictograms.ts',
    'src/tokens.ts',
    'src/format/index.ts',
    'src/components/{DataGrid,FilterPanel,AmountInput,Charts,ECharts,AIChat}/index.ts',
    'src/components/{CreateModal,CreateSidePanel,EditSidePanel,EditTearsheet,EditFullPage}/index.ts',
    'src/components/{RemoveModal,ImportModal,ExportModal,APIKeyModal,AccentTag}/index.ts',
    'src/components/{EnvironmentSwitcher,LogoutBanner,LogoutTile,HelpMenu,ChatElements}/index.ts',
    'src/components/ControlledDatePicker/index.ts',
    'src/theme/use-afframe-theme.ts',
  ],
  outDir: 'dist',
  format: 'esm',
  platform: 'neutral',
  unbundle: true,
  dts: false,
  // Each module is its own output file, so 'use client' stays on it.
  checks: { moduleLevelDirective: false },
});
