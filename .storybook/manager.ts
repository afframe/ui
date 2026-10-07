import { createElement } from 'react';
import { addons } from 'storybook/manager-api';

const sources = ['carbon', 'ibm-products', 'labs', 'extras', 'afframe'];

// Shows a component's source tag as a small badge next to its sidebar name.
// createElement, not JSX: the manager bundle uses the classic JSX runtime.
addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type, tags }) => {
      const source = tags.find((tag) => sources.includes(tag));
      if (type !== 'component' || !source) return name;
      return createElement(
        'span',
        null,
        `${name} `,
        createElement('small', { style: { opacity: 0.6 } }, source)
      );
    },
  },
});
