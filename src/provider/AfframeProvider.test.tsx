import { useFeatureFlag } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';
import { afterEach, expect, test } from 'vitest';
import {
  previewCandidate__Decorator,
  ScrollGradient,
  TextInput,
} from '../index.js';
import { AfframeProvider } from './AfframeProvider.js';

afterEach(() => {
  delete document.documentElement.dataset.afframeTheme;
});

function V12Flag() {
  return <p>{String(useFeatureFlag('enable-v12-release'))}</p>;
}

test('turns on the v12 flag in React', () => {
  render(
    <AfframeProvider>
      <V12Flag />
    </AfframeProvider>
  );
  expect(screen.getByText('true')).toBeTruthy();
});

test('renders a text input with the v12 styles', () => {
  render(
    <AfframeProvider>
      <TextInput id="name" labelText="Name" />
    </AfframeProvider>
  );
  const style = getComputedStyle(screen.getByLabelText('Name'));
  expect(style.backgroundImage).toContain(
    'rgb(224, 224, 224) calc(100% - 4px), rgb(141, 141, 141) 100%'
  );
});

test('light theme writes the white tokens on :root', () => {
  const root = getComputedStyle(document.documentElement);
  expect(root.getPropertyValue('--cds-background').trim()).toBe('#ffffff');
  expect(root.getPropertyValue('--cds-spacing-05').trim()).toBe('1rem');
  expect(getComputedStyle(document.body).backgroundColor).toBe(
    'rgb(255, 255, 255)'
  );
  expect(root.getPropertyValue('--trial-countdown-start').trim()).toBe(
    '#0f62fe'
  );
});

test('dark theme sets the Labs TrialCountdown dark gradient', () => {
  document.documentElement.dataset.afframeTheme = 'dark';
  const root = getComputedStyle(document.documentElement);
  expect(root.getPropertyValue('--trial-countdown-start').trim()).toBe(
    '#4589ff'
  );
  expect(root.getPropertyValue('--trial-countdown-end').trim()).toBe('#be95ff');
});

test('dark theme sets the g100 background', () => {
  document.documentElement.dataset.afframeTheme = 'dark';
  expect(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--cds-background')
      .trim()
  ).toBe('#161616');
  expect(getComputedStyle(document.body).backgroundColor).toBe(
    'rgb(22, 22, 22)'
  );
});

test('renders the canary gated IBM Products components, not the placeholder', () => {
  // IBM types both as ref-only components; the props come from their propTypes.
  const Gradient = ScrollGradient as ComponentType<{ children: ReactNode }>;
  const Decorator = previewCandidate__Decorator as ComponentType<{
    label: string;
    value: string;
  }>;
  const { container } = render(
    <AfframeProvider>
      <Gradient>
        <p>Scrolled content</p>
      </Gradient>
      <Decorator label="Owner" value="Afframe" />
    </AfframeProvider>
  );
  expect(screen.getByText('Scrolled content')).toBeTruthy();
  expect(screen.getByText('Afframe')).toBeTruthy();
  expect(container.querySelector('.c4p--canary')).toBeNull();
  expect(container.textContent).not.toContain('is not ready yet');
});
