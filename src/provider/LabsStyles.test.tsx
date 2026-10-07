import { render, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import {
  DatePicker,
  DatePickerInput,
  SideNav,
  SideNavItems,
  SideNavLink,
} from '../index.js';
import { Calendar } from '../labs/calendar.js';
import { TextHighlighter } from '../labs/text-highlighter.js';
import {
  SideNavItemsLabs,
  SideNavLabs,
  SideNavLinkLabs,
} from '../labs/ui-shell.js';

// Labs CSS in styles.css also matches Carbon components and plain HTML;
// src/styles/index.scss gives those Carbon's (or the browser's) values back.

function styleOf(element: Element | null | undefined, pseudo?: string) {
  if (!element) throw new Error('element not rendered');
  return getComputedStyle(element, pseudo);
}

test('Carbon SideNav keeps Carbon z-index and overflow, Labs SideNav keeps Labs ones', () => {
  const { container } = render(
    <>
      <SideNav aria-label="Carbon" expanded>
        <SideNavItems>
          <SideNavLink href="#">Carbon link</SideNavLink>
        </SideNavItems>
      </SideNav>
      <SideNavLabs aria-label="Labs" expanded>
        <SideNavItemsLabs>
          <SideNavLinkLabs href="#">Labs link</SideNavLinkLabs>
        </SideNavItemsLabs>
      </SideNavLabs>
    </>
  );
  const [carbon, labs] = container.querySelectorAll('nav');
  expect(styleOf(carbon).zIndex).toBe('8000');
  expect(styleOf(carbon).overflow).toBe('hidden');
  expect(styleOf(labs).zIndex).toBe('7999');
  expect(styleOf(labs).overflow).toBe('visible');
});

test('plain del has its line and no screen reader text, TextHighlighter del keeps both', () => {
  const { container } = render(
    <>
      <del id="plain">Plain</del>
      <TextHighlighter kind="del">Labs</TextHighlighter>
    </>
  );
  const plain = container.querySelector('#plain');
  const labs = container.querySelector(
    '.clabs--text-highlighter__container del'
  );
  expect(styleOf(plain).textDecorationLine).toBe('line-through');
  expect(styleOf(plain, '::before').content).toBe('none');
  expect(styleOf(labs).textDecorationLine).toBe('none');
  expect(styleOf(labs, '::before').content).toBe('" [deletion start] "');
});

test('DatePicker selected day keeps Carbon colours, Calendar keeps the Labs highlight', async () => {
  const { container } = render(
    <>
      <div id="carbon">
        <DatePicker datePickerType="single" inline value="01/15/2026">
          <DatePickerInput
            id="date"
            labelText="Date"
            placeholder="mm/dd/yyyy"
          />
        </DatePicker>
      </div>
      <Calendar initialDate={new Date(2026, 0, 15)} />
    </>
  );
  const day = (selector: string) =>
    container.querySelector(`${selector} .flatpickr-day.selected`);
  await waitFor(() => {
    expect(day('#carbon')).toBeTruthy();
    expect(day('.clabs--calendar__date-picker-panel')).toBeTruthy();
  });
  const carbon = styleOf(day('#carbon'));
  expect(carbon.backgroundColor).toBe('rgb(15, 98, 254)');
  expect(carbon.color).toBe('rgb(255, 255, 255)');
  const labs = styleOf(day('.clabs--calendar__date-picker-panel'));
  expect(labs.backgroundColor).toBe('rgb(208, 226, 255)');
  expect(labs.color).toBe('rgb(22, 22, 22)');
});
