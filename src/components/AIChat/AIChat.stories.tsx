import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tile } from '@carbon/react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { ChatContainer, ChatCustomElement } from './ChatContainer.js';
import {
  ButtonItemType,
  MessageResponseTypes,
  OptionItemPreference,
} from '@carbon/ai-chat/server';
import type {
  ChatInstance,
  CustomSendMessageOptions,
  GenericItem,
  MessageRequest,
  RenderUserDefinedResponse,
} from '@carbon/ai-chat';
import mdx from './AIChat.mdx';
import './AIChat.stories.css';

// A canned assistant, no network: every request gets the same text reply.
async function customSendMessage(
  _request: MessageRequest,
  _options: CustomSendMessageOptions,
  instance: ChatInstance
) {
  await instance.messaging.addMessage({
    output: {
      generic: [
        {
          response_type: MessageResponseTypes.TEXT,
          text: 'Invoice 2026-0142 is due on 15 October.',
        },
      ],
    },
  });
}

const messaging = { customSendMessage };

const header = {
  title: 'Assistant',
  menuOptions: [
    { text: 'Export conversation', handler: () => undefined },
    { text: 'Help', handler: () => undefined },
  ],
};

function welcome(...generic: GenericItem[]) {
  return async (instance: ChatInstance) => {
    await instance.messaging.addMessage({ output: { generic } });
  };
}

const greeting: GenericItem = {
  response_type: MessageResponseTypes.TEXT,
  text: 'Hello. Ask about an invoice or a payment.',
};

const responseTypes: GenericItem[] = [
  greeting,
  {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: { invoice: '2026-0142', status: 'Unpaid' },
  },
  {
    response_type: MessageResponseTypes.OPTION,
    title: 'What do you want to see?',
    preference: OptionItemPreference.BUTTON,
    options: [
      { label: 'Open invoices', value: { input: { text: 'Open invoices' } } },
      { label: 'Payments', value: { input: { text: 'Payments' } } },
    ],
  },
  {
    response_type: MessageResponseTypes.BUTTON,
    button_type: ButtonItemType.POST_BACK,
    label: 'Remind me tomorrow',
    value: { input: { text: 'Remind me tomorrow' } },
  },
  {
    response_type: MessageResponseTypes.INLINE_ERROR,
    text: 'The payment service did not answer. Try again later.',
  },
];

// The user_defined item above, drawn with a Carbon tile.
const renderUserDefinedResponse: RenderUserDefinedResponse = (state) => {
  const data = state.messageItem?.user_defined;
  if (!data) return null;
  return (
    <Tile>
      Invoice {String(data.invoice)}: {String(data.status)}
    </Tile>
  );
};

// Finds the first match in the page, looking inside shadow roots too.
function deepQuery(root: ParentNode, selector: string): Element | null {
  const hit = root.querySelector(selector);
  if (hit) return hit;
  for (const element of Array.from(root.querySelectorAll('*'))) {
    if (element.shadowRoot) {
      const found = deepQuery(element.shadowRoot, selector);
      if (found) return found;
    }
  }
  return null;
}

// Whether any text node in the page, shadow roots included, contains text.
function hasText(root: ParentNode, text: string): boolean {
  for (const element of Array.from(root.querySelectorAll('*'))) {
    if (
      Array.from(element.childNodes).some(
        (node) =>
          node.nodeType === Node.TEXT_NODE &&
          (node.textContent ?? '').includes(text)
      )
    ) {
      return true;
    }
    if (element.shadowRoot && hasText(element.shadowRoot, text)) return true;
  }
  return false;
}

// The chat loads after the first render; accessibility checks wait for it.
const openChat = 'cds-aichat-prompt-line';
const launcher = '.cds-aichat--launcher__button';
async function waitForChat(canvasElement: HTMLElement, selector: string) {
  await waitFor(
    async () => {
      await expect(deepQuery(canvasElement, selector)).not.toBeNull();
    },
    { timeout: 10000 }
  );
  await settle(canvasElement);
}

// Every open shadow root in the page, nested ones included.
function shadowRoots(root: ParentNode): ShadowRoot[] {
  const roots: ShadowRoot[] = [];
  for (const element of Array.from(root.querySelectorAll('*'))) {
    if (element.shadowRoot) {
      roots.push(element.shadowRoot, ...shadowRoots(element.shadowRoot));
    }
  }
  return roots;
}

// Finite animations and transitions still running in the page.
function runningAnimations(canvasElement: HTMLElement): Animation[] {
  const all = [document, ...shadowRoots(canvasElement)].flatMap((root) =>
    root.getAnimations()
  );
  return Array.from(new Set(all)).filter(
    (animation) =>
      animation.playState === 'running' &&
      animation.effect?.getComputedTiming().iterations !== Infinity
  );
}

// Whether the element and every ancestor, across shadow roots, is opaque.
function isOpaque(element: Element): boolean {
  for (let node: Node | null = element; node;) {
    if (node instanceof Element) {
      if (getComputedStyle(node).opacity !== '1') return false;
      node = node.parentNode;
    } else {
      node = node instanceof ShadowRoot ? node.host : node.parentNode;
    }
  }
  return true;
}

// The chat fades in; axe checks contrast only after it has finished, so
// every play function ends here.
async function settle(canvasElement: HTMLElement) {
  await waitFor(
    async () => {
      const running = runningAnimations(canvasElement);
      await Promise.allSettled(running.map((animation) => animation.finished));
      await expect(runningAnimations(canvasElement)).toHaveLength(0);
      for (const selector of [
        '[data-testid="header_title"]',
        'textarea',
        '.cds-aichat--launcher__button',
      ]) {
        const element = deepQuery(canvasElement, selector);
        if (element) await expect(isOpaque(element)).toBe(true);
      }
    },
    { timeout: 10000 }
  );
}

// Upstream violations, handled per story:
// - nested-interactive: IBM's header AI label (cds-ai-label) has role="button"
//   on its host and a button inside its shadow root. Only that element is
//   left out of the checks; every rule still runs on the rest of the chat.
// - scrollable-region-focusable: IBM's message list scrolls without being
//   focusable itself. axe leaves out a whole subtree, which here would be
//   every message, so this rule is switched off instead.
const aiLabel = { fromShadowDom: ['cds-aichat-react', 'cds-ai-label'] };
function upstreamA11y(...rules: string[]) {
  return {
    a11y: {
      context: { exclude: [aiLabel] },
      config: { rules: rules.map((id) => ({ id, enabled: false })) },
    },
  };
}

const meta = {
  title: 'Components/AI Chat',
  component: ChatCustomElement,
  tags: ['extras'],
  parameters: {
    docs: { page: mdx },
  },
  args: {
    className: 'demo-chat-embedded',
    messaging,
    header,
    openChatByDefault: true,
    layout: { showFrame: false },
  },
  play: async ({ canvasElement }) => {
    await waitForChat(canvasElement, openChat);
  },
} satisfies Meta<typeof ChatCustomElement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: upstreamA11y(),
  args: { namespace: 'default', onBeforeRender: welcome(greeting) },
  // Renders under AfframeProvider (the Storybook decorator) without a
  // web-components feature-flags element around it, and its header overflow
  // menu opens.
  play: async (context) => {
    const { canvasElement } = context;
    await waitForChat(canvasElement, openChat);
    const host = deepQuery(canvasElement, 'cds-aichat-react');
    const container = canvasElement.querySelector(
      '[data-afframe-extra="ai-chat"]'
    );
    await expect(host).not.toBeNull();
    await expect(container).not.toBeNull();
    await expect(host?.closest('feature-flags')).toBeNull();
    await expect(container?.closest('feature-flags')).toBeNull();

    const menu = deepQuery(canvasElement, 'cds-overflow-menu');
    await expect(
      deepQuery(canvasElement, 'cds-overflow-menu-body')?.hasAttribute('open')
    ).toBe(false);
    const trigger = menu?.shadowRoot?.querySelector('button');
    await expect(trigger).toBeTruthy();
    await userEvent.click(trigger as HTMLButtonElement);
    await waitFor(async () => {
      const body = deepQuery(canvasElement, 'cds-overflow-menu-body');
      await expect(body?.hasAttribute('open')).toBe(true);
      const items = Array.from(
        body?.querySelectorAll('cds-overflow-menu-item') ?? []
      );
      await expect(items.map((item) => item.textContent.trim())).toEqual([
        'Export conversation',
        'Help',
      ]);
      for (const item of items) {
        await expect(item.checkVisibility()).toBe(true);
      }
    });
    await settle(canvasElement);
  },
};

export const ResponseTypes: Story = {
  parameters: upstreamA11y('scrollable-region-focusable'),
  args: {
    namespace: 'responses',
    onBeforeRender: welcome(...responseTypes),
    renderUserDefinedResponse,
  },
  // Every item has rendered, the user_defined one through the Carbon tile.
  play: async ({ canvasElement }) => {
    await waitForChat(canvasElement, openChat);
    await waitFor(
      async () => {
        await expect(deepQuery(canvasElement, '.cds--tile')?.textContent).toBe(
          'Invoice 2026-0142: Unpaid'
        );
        await expect(hasText(canvasElement, 'did not answer')).toBe(true);
        await expect(hasText(canvasElement, 'Remind me tomorrow')).toBe(true);
      },
      { timeout: 10000 }
    );
    await settle(canvasElement);
  },
};

// The assistant is answering: the chat shows its loading indicator.
export const Loading: Story = {
  parameters: upstreamA11y(),
  args: {
    namespace: 'loading',
    onBeforeRender: (instance) => {
      instance.updateIsMessageLoadingCounter('increase');
    },
  },
};

// ChatContainer: a launcher fixed to the corner of the viewport opens a
// floating panel.
export const Float: Story = {
  play: async ({ canvasElement }) => {
    await waitForChat(canvasElement, launcher);
  },
  render: () => (
    <div className="demo-chat-float">
      <ChatContainer messaging={messaging} header={header} namespace="float" />
    </div>
  ),
};

// ChatCustomElement in a side column of the page.
export const Sidebar: Story = {
  parameters: upstreamA11y(),
  args: {
    namespace: 'sidebar',
    className: 'demo-chat-sidebar',
    onBeforeRender: welcome(greeting),
  },
  // The class sizes the chat as a flex item of the page: 22.5rem wide and as
  // tall as the page.
  play: async ({ canvasElement }) => {
    await waitForChat(canvasElement, openChat);
    const page = canvasElement.querySelector('.demo-chat-sidebar-page');
    const chat = canvasElement.querySelector('div.demo-chat-sidebar');
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    await expect(chat?.getBoundingClientRect().width).toBe(22.5 * rem);
    await expect(chat?.getBoundingClientRect().height).toBe(
      page?.getBoundingClientRect().height
    );
  },
  render: (args) => (
    <div className="demo-chat-sidebar-page">
      <main>Page content</main>
      <ChatCustomElement {...args} />
    </div>
  ),
};

export const Dark: Story = {
  parameters: upstreamA11y(),
  args: { namespace: 'dark', onBeforeRender: welcome(greeting) },
  globals: { theme: 'dark' },
};
