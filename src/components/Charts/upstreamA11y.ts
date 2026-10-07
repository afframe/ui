// Story parameters that keep every axe rule on and skip only the Carbon
// Charts nodes that break a rule upstream. Listed in Charts.mdx.
// Toolbar controls (nested-interactive): a div role="button" around a button.
const toolbarControls = '.cds--cc--toolbar .toolbar-control';
// Shapes with aria-label and no role (aria-prohibited-attr).
export const alluvialLinks = 'path.link[id*="alluvial-line-"]';
export const heatmapCells = 'g.cell > rect.heat';

export function upstreamA11y(...extra: string[]) {
  return {
    a11y: { context: { exclude: [toolbarControls, ...extra] } },
  };
}
