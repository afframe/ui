import { styles as typeStyles } from '@carbon/type';

const carbonCustomProps = { severity: 'error', acceptCarbonCustomProp: true };

// Carbon emits each type style as --cds-<style>-<property> custom properties,
// which the plugin's token list does not include.
const typeCustomProps = Object.keys(typeStyles).flatMap((name) => {
  const style = name.replace(/[A-Z]|\d+/g, (part) => `-${part.toLowerCase()}`);
  return [
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'letter-spacing',
  ].map((property) => `--cds-${style}-${property}`);
});

export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-plugin-carbon-tokens/config/recommended.js',
  ],
  plugins: ['stylelint-plugin-carbon-tokens'],
  overrides: [
    {
      // Story and Storybook CSS: Carbon tokens as var(--cds-*) custom
      // properties; selectors target Carbon's BEM class names.
      files: ['**/*.css'],
      rules: {
        'selector-class-pattern': null,
        'carbon/layout-use': [true, carbonCustomProps],
        'carbon/theme-use': [
          true,
          { ...carbonCustomProps, validateGradients: 'recommended' },
        ],
        'carbon/theme-layer-use': [true, carbonCustomProps],
        'carbon/type-use': [
          true,
          { ...carbonCustomProps, validateVariables: typeCustomProps },
        ],
        'carbon/motion-duration-use': [true, carbonCustomProps],
        'carbon/motion-easing-use': [true, carbonCustomProps],
      },
    },
  ],
};
