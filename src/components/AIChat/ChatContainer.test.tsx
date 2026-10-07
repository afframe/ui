import { render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { ChatContainer, ChatCustomElement } from './ChatContainer.js';
import { createLoader, loadChat } from './chat-loader.js';
import type { ChatModule } from './chat-loader.js';

vi.mock('./chat-loader.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./chat-loader.js')>()),
  loadChat: vi.fn(),
}));

const load = vi.mocked(loadChat);

// Stands in for @carbon/ai-chat, which the real loader imports.
const fakeChat = {
  ChatContainer: () => <p>Loaded container</p>,
  ChatCustomElement: () => <p>Loaded custom element</p>,
} as unknown as ChatModule;

afterEach(() => {
  load.mockReset();
});

test('the loader drops a failed import and tries again', async () => {
  const importer = vi
    .fn<() => Promise<string>>()
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue('chat');
  const loader = createLoader(importer);
  await expect(loader()).rejects.toThrow('offline');
  await expect(loader()).resolves.toBe('chat');
  await expect(loader()).resolves.toBe('chat');
  expect(importer).toHaveBeenCalledTimes(2);
});

test('a failed load shows an error, and a remount tries again', async () => {
  load.mockRejectedValueOnce(new Error('offline'));
  const first = render(<ChatContainer />);
  expect(
    await screen.findByText(
      'The chat could not load. Reload the page to try again.'
    )
  ).toBeTruthy();
  first.unmount();

  load.mockResolvedValue(fakeChat);
  render(<ChatContainer />);
  expect(await screen.findByText('Loaded container')).toBeTruthy();
  expect(load).toHaveBeenCalledTimes(2);
});

test('the error message is overridable', async () => {
  load.mockRejectedValue(new Error('offline'));
  render(
    <ChatCustomElement
      className="chat"
      messages={{ loadError: 'Chat unavailable.' }}
    />
  );
  expect(await screen.findByText('Chat unavailable.')).toBeTruthy();
});

test('the chat renders in a wrapper that takes no box', async () => {
  load.mockResolvedValue(fakeChat);
  const { container } = render(<ChatCustomElement className="chat" />);
  expect(await screen.findByText('Loaded custom element')).toBeTruthy();
  const wrapper = container.querySelector('[data-afframe-extra="ai-chat"]');
  expect(wrapper && getComputedStyle(wrapper).display).toBe('contents');
});
