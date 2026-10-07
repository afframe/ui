import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { MessageResponseTypes } from '@carbon/ai-chat/server';
import type {
  ChatInstance,
  CustomSendMessageOptions,
  GenericItem,
  MessageRequest,
} from '@carbon/ai-chat';
import { ChatCustomElement } from '../AIChat/ChatContainer.js';
import { renderChatElement } from './renderChatElement.js';
import mdx from './ChatElements.mdx';
import '../AIChat/AIChat.stories.css';

const elements: GenericItem[] = [
  {
    response_type: MessageResponseTypes.USER_DEFINED,
    user_defined: {
      user_defined_type: 'afframe-chart',
      chart_type: 'bar',
      title: 'Revenue by region',
      summary: 'Prague 2,000; Brno 1,400.',
      data: [
        { group: 'Prague', value: 2000 },
        { group: 'Brno', value: 1400 },
      ],
    },
  },
  // Code needs no Afframe renderer: the chat's markdown draws it. (Its
  // markdown table fails axe in @carbon/ai-chat 1.22, so none is shown.)
  {
    response_type: MessageResponseTypes.TEXT,
    text: ['```http', 'GET /invoices?status=open', '```'].join('\n'),
  },
];

// A canned assistant, no network: every request gets a chart element and
// a markdown code block, which the chat renders natively.
async function customSendMessage(
  _request: MessageRequest,
  _options: CustomSendMessageOptions,
  instance: ChatInstance
) {
  await instance.messaging.addMessage({ output: { generic: elements } });
}

const meta = {
  title: 'Components/Chat Elements/In chat',
  component: ChatCustomElement,
  // Tagged extras, not afframe: Afframe stories take no a11y exceptions, and
  // IBM's chat header AI label (cds-ai-label) has role="button" on its host
  // and a button in its shadow root (nested-interactive). Only that element
  // is left out, as in the AI Chat stories.
  tags: ['extras'],
  parameters: {
    docs: { page: mdx },
    a11y: {
      context: {
        exclude: [{ fromShadowDom: ['cds-aichat-react', 'cds-ai-label'] }],
      },
    },
  },
  args: {
    className: 'demo-chat-embedded',
    namespace: 'chat-elements',
    messaging: { customSendMessage },
    openChatByDefault: true,
    layout: { showFrame: false },
    renderUserDefinedResponse: renderChatElement,
    onBeforeRender: async (instance: ChatInstance) => {
      await instance.messaging.addMessage({ output: { generic: elements } });
    },
  },
  // The chart renders in the chat's message slot (light DOM); the markdown
  // code block renders inside the chat.
  play: async ({ canvasElement }) => {
    await waitFor(
      async () => {
        await expect(
          canvasElement.querySelector('.afframe-chat-chart figure svg')
        ).not.toBeNull();
      },
      { timeout: 15000 }
    );
    await Promise.allSettled(
      document.getAnimations().map((animation) => animation.finished)
    );
  },
} satisfies Meta<typeof ChatCustomElement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InChat: Story = {};
