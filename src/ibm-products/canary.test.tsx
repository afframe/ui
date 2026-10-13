import { render, screen } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';
import { expect, test } from 'vitest';
import { previewCandidate__Decorator } from './decorator.js';
import { ScrollGradient } from './scroll-gradient.js';

test('renders the canary gated IBM Products components without the provider', () => {
  // IBM types both as ref-only components; the props come from their propTypes.
  const Gradient = ScrollGradient as ComponentType<{ children: ReactNode }>;
  const Decorator = previewCandidate__Decorator as ComponentType<{
    label: string;
    value: string;
  }>;
  const { container } = render(
    <>
      <Gradient>
        <p>Scrolled content</p>
      </Gradient>
      <Decorator label="Owner" value="Afframe" />
    </>
  );
  expect(screen.getByText('Scrolled content')).toBeTruthy();
  expect(screen.getByText('Afframe')).toBeTruthy();
  expect(container.querySelector('.c4p--canary')).toBeNull();
  expect(container.textContent).not.toContain('is not ready yet');
});
