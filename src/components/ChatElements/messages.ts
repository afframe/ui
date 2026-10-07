'use client';
// Every user-facing string of the chat elements (ADR 0014). The shared keys
// are spread into each element's own messages.

export interface ChatElementsMessages {
  /** Accessible text of the skeleton while an element loads or streams. */
  loading: string;
  /** Shown instead of an element whose payload is not valid. */
  invalid: (type: string) => string;
  /** Shown when an element's engine (the chart code) fails to load. */
  loadError: string;
}

export const defaultChatElementsMessages: ChatElementsMessages = {
  loading: 'Loading',
  invalid: () => 'This content could not be shown.',
  loadError: 'This content could not load. Reload the page to try again.',
};

export interface ChatChartMessages extends ChatElementsMessages {
  /** Accessible name of the chart; `title` is the payload's title. */
  chartLabel: (title: string | undefined) => string;
}

export const defaultChatChartMessages: ChatChartMessages = {
  ...defaultChatElementsMessages,
  chartLabel: (title) => title ?? 'Chart',
};
