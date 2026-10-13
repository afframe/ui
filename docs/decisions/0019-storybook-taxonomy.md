# 19. Storybook taxonomy

Date: 2026-10-12

## Status

Accepted

## Context

Copied docs pages kept the top-level section of the Storybook they came from. The sidebar had Carbon's, IBM Products' and Afframe's sections side by side (`Patterns`, `Preview Candidate`, `Deprecated`, `Afframe`), no welcome page, `Feature Flags` and `Formatting` in the component list, and no sort order, so entries showed in file discovery order. Afframe titles were in words (`Data Grid`), Carbon titles were export names (`DataTable`).

## Decision

The sidebar follows Carbon's Storybook layout, with Afframe's content merged into it.

| Section         | Holds                                                                                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Getting Started | Welcome, Theming, AfframeProvider, Formatting, Feature Flags, in this order                                                                                                                   |
| Components      | Every component; a family of siblings shares a subfolder (`Create and Edit`, `Empty States`, `Fluid Inputs`, `Notifications`, `Skeletons`, `UI Shell`, `Charts`, `Onboarding`, `AI`, `Cards`) |
| Elements        | Tokens, typography, icons, pictograms, IBM Plex                                                                                                                                               |
| Layout          | Grid, FlexGrid, Layer, Stack, AspectRatio, Heading (covers Section)                                                                                                                           |
| Hooks           | React hooks                                                                                                                                                                                   |
| Utilities       | Helpers without their own look (ActionBar, Cascade, ErrorBoundary, IdPrefix)                                                                                                                  |
| Preview         | `preview__` and `previewCandidate__` exports, under those names                                                                                                                               |

- Sections come in this order; everything inside is sorted A to Z by path (`storySort` in `.storybook/preview.tsx`). Stories of one component keep their file order.
- A component's title is its export name (`Components/DataGrid`, `Components/UI Shell/HelpMenu`, `Preview/previewCandidate__Toolbar`). A page for a module with several exports takes the module name (`Components/AI/AIChat`). A family subfolder and a page that is not a component are in words, in Title Case.
- Sub-pages of a component use the same words everywhere: `Feature Flags`, `Examples`, `Docs`.
- Story names come from PascalCase export names, with no `name` override unless the name needs characters an identifier cannot hold. A component page starts with `Default`: the basic use, with controls. Exempt: sub-pages, chart-type pages, Hooks and Carbon's UI Shell showcase pages.
- Variants read the same across components: `With X` for an added element, one word for a state (`Disabled`, `Skeleton`, `Inline`). Feature flag stories are named by what they show.
- Theme copies (`Dark`) and Carbon's `Test*` stories are test fixtures: tagged `!dev` and `!autodocs`, so they run as tests but stay out of the sidebar and docs pages. The theme toolbar shows any story in dark.
- Where a component comes from shows as the sidebar badge and the docs page label, not as a section.
- Storybook's own onboarding checklist and release notes popup are off.

## Options not chosen

- Keep each upstream's sections: three Storybooks in one sidebar, and the source is already shown by the badge.
- Group by job (Inputs, Data, Feedback): differs from Carbon's Storybook, so a copied page lands somewhere else than upstream.

## Consequences

- Story ids change with the titles; links between docs pages use the new ids.
- A new component picks its section and, for a family, its subfolder from this table.
