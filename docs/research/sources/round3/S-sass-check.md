# S · Sass compile check: Carbon + IBM Products with v12 on
Run: 2026-09-24, orchestrator, in a scratch workspace.

Setup: sass 1.105.0, @carbon/styles 1.116.0, @carbon/react 1.117.0 (its scss is imported by IBM Products styles), @carbon/ibm-products-styles 2.95.0 (latest on npm; it imports @carbon-labs/react-resizer/scss, so @carbon-labs/react-resizer 0.25.0 is also required).

v12.scss:
    @use '@carbon/styles/scss/feature-flags' with ($feature-flags: ('enable-v12-release': true));
    @use '@carbon/styles';
    @use '@carbon/ibm-products-styles/scss/index-without-carbon';
v11.scss: the same without the feature-flags line.

Results:
- Both compile with exit 0 and no errors (v11 6 s, 1,954,484 bytes; v12 7 s, 1,961,685 bytes).
- 199 CSS rules differ between v11 and v12. Every changed selector is a core Carbon class: ai-label, btn, combo-box, date-picker, dropdown, label, layer-two/three, layout, list-box, multi-select, number(-input), popover(-caret/-content), progress-bar, search(-input), select(-input), slug, structured-list, tag, text-input, toggletip, tooltip.
- No IBM Products (`.c4p--*`) rule changes: IBM Products' own styles are v12-agnostic. Carbon elements used inside IBM Products components (buttons, tags, inputs) do get the v12 styling, because they are compiled in the same build.
- Conclusion: turning v12 on does not break the combined Sass build. Visual consistency of IBM Products components under v12 still needs a rendered check (Storybook visual tests), not covered here.
