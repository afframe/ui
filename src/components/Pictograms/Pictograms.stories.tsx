import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import {
  Airplane,
  Analytics,
  Bee,
  Cloud,
  Globe,
  Rocket,
} from '../../pictograms.js';
import mdx from './Pictograms.mdx';
import './Pictograms.stories.css';

const sample = { Airplane, Analytics, Bee, Cloud, Globe, Rocket };

const meta = {
  title: 'Elements/Pictograms',
  component: Bee,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
  args: {
    width: 64,
    height: 64,
  },
} satisfies Meta<typeof Bee>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: (args) => (
    <ul className="demo-pictogram-grid">
      {Object.entries(sample).map(([name, Pictogram]) => (
        <li key={name}>
          <figure>
            <Pictogram {...args} />
            <figcaption>{name}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  ),
};
