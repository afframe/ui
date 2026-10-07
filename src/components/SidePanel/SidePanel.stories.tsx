/**
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, story styles in CSS, side panel decorator, feature flag wrapper and trigger helper inlined (feature flags through preview__FeatureFlags), header theme through Theme. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Decorator, Meta, StoryFn } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import type {
  ComponentProps,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
} from 'react';
import { action } from 'storybook/actions';
import {
  AILabel,
  AILabelContent,
  Button,
  Content,
  DataTable,
  Header,
  HeaderContainer,
  HeaderName,
  MultiSelect,
  SidePanel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TextArea,
  TextInput,
  Theme,
  preview__FeatureFlags as FeatureFlags,
} from '../../index.js';
import type { SidePanelProps } from '../../index.js';
import { Copy, Settings, TrashCan } from '../../icons.js';
import mdx from './SidePanel.mdx';
import './side-panel-story.css';

type PanelButton = NonNullable<SidePanelProps['actions']>[number];

type StoryArgs = Partial<
  Omit<
    ComponentProps<typeof SidePanel>,
    | 'actions'
    | 'actionToolbarButtons'
    | 'aiLabel'
    | 'slug'
    | 'decorator'
    | 'open'
    | 'children'
    | 'title'
    | 'subtitle'
  >
> & {
  actions?: number;
  actionToolbarButtons?: number;
  aiLabel?: number;
  slug?: number;
  decorator?: number;
  jsFlags?: string[];
  minimalContent?: boolean;
  title?: string | null;
  subtitle?: ReactNode;
  'aria-label'?: string;
};

const prefix = 'side-panel-stories__';

const defaultStoryProps = {
  title:
    'Incident management for your application, testing a very long title to see how this behaves with a longer title',
  subtitle: (
    <>
      This is some text that would talk about how you could{' '}
      <strong>investigate</strong> incident management within this side panel.
    </>
  ),
  id: 'storybook-sidepanel',
  size: 'md',
  placement: 'right',
} satisfies StoryArgs;

const headerData = [
  { id: 1, header: 'Column header', key: 'value' },
  { id: 2, header: 'Column header', key: 'value' },
];

const rowData = [
  {
    id: 'a',
    value: 'Cell text a',
  },
  {
    id: 'b',
    value: 'Cell text b',
  },
  {
    id: 'c',
    value: 'Cell text c',
  },
  {
    id: 'd',
    value: 'Cell text d',
  },
  {
    id: 'e',
    value: 'Cell text d',
  },
  {
    id: 'f',
    value: 'Cell text f',
  },
  {
    id: 'g',
    value: 'Cell text g',
  },
  {
    id: 'h',
    value: 'Cell text h',
  },
];

const actions_1: PanelButton[] = [
  {
    label: 'Submit',
    onClick: action('Clicked action button'),
    kind: 'primary',
  },
];

const actions_2: PanelButton[] = [
  {
    label: 'Ghost button',
    onClick: action('Clicked action button'),
    kind: 'ghost',
  },
];

const actions_3: PanelButton[] = [
  {
    label: 'Danger button',
    onClick: action('Clicked action button'),
    kind: 'danger',
  },
];

const actions_4: PanelButton[] = [
  {
    label: 'Submit',
    onClick: action('Clicked action button'),
    kind: 'primary',
  },
  {
    label: 'Cancel',
    onClick: action('Clicked action button'),
    kind: 'secondary',
  },
];

const actions_5: PanelButton[] = [
  {
    label: 'Ghost button',
    onClick: action('Clicked action button'),
    kind: 'ghost',
  },
  {
    label: 'Submit',
    onClick: action('Clicked action button'),
    kind: 'primary',
  },
];

const actions_6: PanelButton[] = [
  {
    label: 'Ghost button',
    onClick: action('Clicked action button'),
    kind: 'ghost',
  },
  {
    label: 'Danger button',
    onClick: action('Clicked action button'),
    kind: 'danger',
  },
];

const actions_7: PanelButton[] = [
  {
    label: 'Submit',
    onClick: action('Clicked action button'),
    kind: 'primary',
  },
  {
    label: 'Cancel',
    onClick: action('Clicked action button'),
    kind: 'secondary',
  },
  {
    label: 'Ghost button',
    onClick: action('Clicked action button'),
    kind: 'ghost',
  },
];

const actions_8: PanelButton[] = [
  {
    label: 'Cancel',
    onClick: action('Clicked action button'),
    kind: 'secondary',
  },
  {
    label: 'Cancel',
    onClick: action('Clicked action button'),
    kind: 'secondary',
  },
  {
    label: 'Danger button',
    onClick: action('Clicked action button'),
    kind: 'danger',
  },
];

const actions_9: PanelButton[] = [
  {
    label: 'Submit',
    onClick: action('Clicked action button'),
    kind: 'primary',
  },
  {
    label: 'Cancel',
    onClick: action('Clicked action button'),
    kind: 'secondary',
  },
  {
    label: 'Cancel',
    onClick: action('Clicked action button'),
    kind: 'secondary',
  },
];

type IconProps = ComponentProps<typeof Copy>;

const toolbarItem_1: PanelButton[] = [
  {
    leading: true,
    label: 'Copy',
    icon: (props: IconProps) => <Copy size={16} {...props} />,
    onClick: action('Toolbar button clicked: Copy'),
    kind: 'primary',
  },
];

const toolbarItem_2: PanelButton[] = [
  {
    leading: true,
    label: 'Copy',
    icon: (props: IconProps) => <Copy size={16} {...props} />,
    onClick: action('Toolbar button clicked: Copy'),
    kind: 'primary',
  },
  {
    label: 'Settings',
    icon: (props: IconProps) => <Settings size={16} {...props} />,
    onClick: action('Toolbar button clicked: Settings'),
    hasIconOnly: true,
  },
];

const toolbarItem_3: PanelButton[] = [
  {
    leading: true,
    label: 'Copy',
    icon: (props: IconProps) => <Copy size={16} {...props} />,
    onClick: action('Toolbar button clicked: Copy'),
    kind: 'primary',
  },
  {
    label: 'Settings',
    icon: (props: IconProps) => <Settings size={16} {...props} />,
    onClick: action('Toolbar button clicked: Settings'),
    hasIconOnly: true,
  },
  {
    label: 'Delete',
    icon: (props: IconProps) => <TrashCan size={16} {...props} />,
    onClick: action('Toolbar button clicked: Delete'),
    hasIconOnly: true,
  },
];

const toolbarActions = [undefined, toolbarItem_1, toolbarItem_2, toolbarItem_3];

const actionSets = [
  actions_1,
  actions_2,
  actions_3,
  actions_4,
  actions_5,
  actions_6,
  actions_7,
  actions_8,
  actions_9,
  [],
];

const sampleAILabel = (
  <AILabel className="aiLabel-container" size="xs" align="bottom">
    <AILabelContent>
      <div>
        <p className="secondary">AI Explained</p>
        <h1>84%</h1>
        <p className="secondary bold">Confidence score</p>
        <p className="secondary">
          This is not really Lorem Ipsum but the spell checker did not like the
          previous text with it&apos;s non-words which is why this unwieldy
          sentence, should one choose to call it that, here.
        </p>
        <hr />
        <p className="secondary">Model type</p>
        <p className="bold">Foundation model</p>
      </div>
    </AILabelContent>
  </AILabel>
);

// From IBM's story-helper: a button that toggles the side panel.
const renderTrigger = ({
  open,
  setOpen,
  buttonRef,
  name,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  name: string;
}) => (
  <Button
    ref={buttonRef}
    onClick={() => setOpen(!open)}
    className={`${prefix}toggle`}>
    {open ? `Close ${name}` : `Open ${name}`}
  </Button>
);

// Spreads the story args into SidePanel props: the select controls hold
// indexes into the sample sets above.
const panelProps = ({
  actions,
  aiLabel,
  slug,
  decorator,
  actionToolbarButtons,
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- taken out, so it is not passed to the component
  jsFlags,
  ...args
}: StoryArgs) =>
  ({
    ...args,
    ...(title ? { title } : {}),
    actions: actions === undefined ? undefined : actionSets[actions],
    aiLabel: aiLabel ? sampleAILabel : undefined,
    slug: slug ? sampleAILabel : undefined,
    decorator: decorator ? sampleAILabel : undefined,
    actionToolbarButtons:
      actionToolbarButtons === undefined
        ? undefined
        : toolbarActions[actionToolbarButtons],
  }) as SidePanelProps;

const ChildrenContent = () => {
  const [notesValue, setNotesValue] = useState('');
  return (
    <div className={`${prefix}body-content`}>
      <h3 className={`${prefix}body-subheading`}>Section</h3>
      <div className={`${prefix}text-inputs`}>
        <TextInput
          labelText="Input A"
          id="side-panel-story-text-input-a"
          className={`${prefix}text-input`}
        />
        <TextInput
          labelText="Input B"
          id="side-panel-story-text-input-b"
          className={`${prefix}text-input`}
        />
      </div>
      <div className={`${prefix}text-inputs`}>
        <TextInput
          labelText="Input C"
          id="side-panel-story-text-input-c"
          className={`${prefix}text-input`}
        />
        <TextInput
          labelText="Input D"
          id="side-panel-story-text-input-d"
          className={`${prefix}text-input`}
        />
      </div>
      <div className={`${prefix}multi-select-container`}>
        <MultiSelect
          data-testid="alert--subtype--transfer--secondary-zones"
          id="multiselectA"
          titleText="Multiselect A"
          label="Select an item"
          items={[
            {
              value: 'all',
              label: 'Multiselect A',
            },
          ]}
          selectionFeedback="top-after-reopen"
        />
      </div>
      <div className={`${prefix}text-area-container`}>
        <span
          className={[
            `${prefix}allowed-characters`,
            `${
              notesValue.length > 100
                ? `${prefix}allowed-characters-invalid`
                : null
            }`,
          ].join(' ')}>
          {notesValue.length}/100
        </span>
        <TextArea
          id="side-panel-textarea"
          className={`${prefix}text-area`}
          labelText="Notes"
          value={notesValue}
          onChange={(event) => setNotesValue(event.target.value)}
        />
      </div>
      <h3 className={`${prefix}content-subtitle ${prefix}body-subheading`}>
        Section
      </h3>
      {renderDataTable()}
    </div>
  );
};

const ChildrenContentWithSteps = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <>
      {currentStep === 0 && (
        <div className={`${prefix}body-content`}>
          <h3 className={`${prefix}content-subtitle ${prefix}body-subheading`}>
            Main view
          </h3>
          {renderDataTable()}
          <Button
            kind="tertiary"
            onClick={() => setCurrentStep((prev) => prev + 1)}>
            View all
          </Button>
        </div>
      )}
      {currentStep === 1 && (
        <div className={`${prefix}body-content`}>
          <h3 className={`${prefix}content-subtitle ${prefix}body-subheading`}>
            Detail view
          </h3>
          {renderDataTable()}
        </div>
      )}
    </>
  );
};

const renderDataTable = () => {
  return (
    <DataTable
      rows={rowData}
      headers={headerData}
      render={({ rows, headers }) => (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHeader key={index}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {row.cells.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  );
};

const renderUIShellHeader = () => (
  <HeaderContainer
    render={() => (
      <Theme theme="g100">
        <Header aria-label="IBM Cloud Pak" className={`${prefix}header`}>
          <HeaderName href="/" prefix="IBM">
            Cloud Pak
          </HeaderName>
        </Header>
      </Theme>
    )}
  />
);

// From IBM's sidePanelDecorator and WithFeatureFlags: the jsFlags control
// wraps the story in preview__FeatureFlags with the selected flags.
const sidePanelDecorator: Decorator<StoryArgs> = (Story, context) => {
  const { jsFlags } = context.args;
  return (
    <div className={`${prefix}container`}>
      {renderUIShellHeader()}
      <Content className={`${prefix}content`}>
        {jsFlags && jsFlags.length !== 0 ? (
          <FeatureFlags
            flags={Object.fromEntries(jsFlags.map((flag) => [flag, true]))}>
            <Story />
          </FeatureFlags>
        ) : (
          <Story />
        )}
      </Content>
    </div>
  );
};

export default {
  title: 'Components/SidePanel',
  component: SidePanel,
  tags: ['ibm-products'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    actionToolbarButtons: {
      control: {
        type: 'select',
        labels: {
          0: 'None',
          1: 'One button',
          2: 'Two buttons',
          3: 'Three buttons',
        },
      },
      description: 'Sets the action toolbar buttons',
      options: [0, 1, 2, 3],
    },
    actions: {
      control: {
        type: 'select',
        labels: {
          0: 'One button',
          1: 'One button (ghost)',
          2: 'One button (danger)',
          3: 'Two buttons',
          4: 'Two buttons with ghost',
          5: 'Two buttons with danger',
          6: 'Three buttons with ghost',
          7: 'Three buttons with danger',
          8: 'Three buttons',
          9: 'None',
        },
      },
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    aiLabel: {
      control: {
        type: 'select',
        labels: {
          0: 'No AI Label',
          1: 'with AI Label',
        },
      },
      description:
        'Optional prop that is intended for any scenario where something is being generated by AI to reinforce AI transparency, accountability, and explainability at the UI level.',
      options: [0, 1],
    },

    animateTitle: {
      control: {
        type: 'boolean',
      },
      description: 'Determines if the title will animate on scroll',
    },
    className: {
      control: {
        type: 'text',
      },
      description:
        'Sets an optional className to be added to the side panel outermost element',
    },
    closeIconDescription: {
      control: {
        type: 'text',
      },
      description: 'Sets the close button icon description',
    },
    closeIconTooltipAlignment: {
      control: {
        type: 'text',
      },
      description: 'Sets the close button tooltip alignment',
    },
    condensedActions: {
      control: {
        type: 'boolean',
      },
      description:
        'Determines whether the side panel should render the condensed version (affects action buttons primarily)',
    },
    currentStep: {
      control: false,
      description: 'Sets the current step of the side panel',
    },
    decorator: {
      control: {
        type: 'select',
        labels: {
          0: 'No AI Label',
          1: 'with AI Label',
        },
      },
      description:
        'Optional prop that is intended for any scenario where something is being generated by AI to reinforce AI transparency, accountability, and explainability at the UI level.',
      options: [0, 1],
    },
    hideCloseButton: {
      control: {
        type: 'boolean',
      },
      description: 'Show/hide the "X" close button.',
    },
    id: {
      control: {
        type: 'text',
      },
      description: 'Unique identifier',
    },
    includeOverlay: {
      control: {
        type: 'boolean',
      },
      description:
        'Determines whether the side panel should render with an overlay',
    },
    labelText: {
      control: {
        type: 'text',
      },
      description:
        'Sets the label text which will display above the title text',
    },
    launcherButtonRef: {
      control: false,
      description:
        'Provide a ref to return focus to once the side panel is closed.',
    },
    navigationBackIconDescription: {
      control: {
        type: 'text',
      },
      description:
        'Sets the icon description for the navigation back icon button',
    },
    onNavigationBack: {
      control: false,
      description: 'Changes the current side panel page to the previous page',
    },
    onRequestClose: {
      control: false,
      description:
        'Specify a handler for closing the side panel. This handler closes the modal, e.g. changing `open` prop.',
    },
    onUnmount: {
      control: false,
      description:
        'Optional function called when the side panel exit animation is complete. This handler can be used for any state cleanup needed before the panel is removed from the DOM.',
    },
    placement: {
      control: {
        type: 'select',
        labels: {
          0: 'Left',
          1: 'Right',
        },
      },
      options: ['left', 'right'],
      description: 'Determines if the side panel is on the right or left',
    },
    preventCloseOnClickOutside: {
      control: {
        type: 'boolean',
      },
      description: 'Prevent closing on click outside of the panel',
    },
    selectorPageContent: {
      control: {
        type: 'text',
      },
      description:
        'This is the selector to the element that contains all of the page content that will shrink if the panel is a slide in. This prop is required when using the `slideIn` variant of the side panel.',
    },
    selectorPrimaryFocus: {
      control: {
        type: 'text',
      },
      description:
        'Specify a CSS selector that matches the DOM element that should be focused when the side panel opens',
    },
    size: {
      control: {
        type: 'select',
        labels: {
          0: 'Extra small (xs)',
          1: 'Small (sm)',
          2: 'Medium (md)',
          3: 'Large (lg)',
          4: 'Extra large (xl)',
          5: 'Double xl (2xl)',
        },
      },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Sets the size of the side panel',
    },
    slideIn: {
      table: {
        disable: true,
      },
    },
    slug: {
      control: {
        type: 'select',
        labels: {
          0: 'No AI slug',
          1: 'with AI Slug',
        },
      },
      options: [0, 1],
    },
    subtitle: {
      control: {
        type: 'object',
      },
      description: 'Sets the subtitle element',
    },
    title: {
      control: {
        type: 'text',
      },
      description: 'Sets the title text',
    },
    jsFlags: {
      name: 'JS Flags',
      control: 'check',
      options: ['enableSidepanelResizer'],
      description: 'wraps the stories with the selected flag',
      table: {
        category: 'Feature Flags',
      },
    },
  },
  decorators: [sidePanelDecorator],
} satisfies Meta;

const SlideOverTemplate: StoryFn<StoryArgs> = (
  { minimalContent, ...args },
  context
) => {
  const [open, setOpen] = useState(context.viewMode !== 'docs');
  const testRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {renderTrigger({ open, setOpen, buttonRef, name: 'side panel' })}
      <SidePanel
        {...panelProps(args)}
        open={open}
        onRequestClose={() => setOpen(false)}
        ref={testRef}
        launcherButtonRef={buttonRef}>
        {!minimalContent && <ChildrenContent />}
      </SidePanel>
    </>
  );
};

const FirstElementDisabledTemplate: StoryFn<StoryArgs> = (
  { minimalContent, ...args },
  context
) => {
  const [open, setOpen] = useState(context.viewMode !== 'docs');
  const testRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {renderTrigger({ open, setOpen, buttonRef, name: 'side panel' })}
      <SidePanel
        {...panelProps(args)}
        open={open}
        onRequestClose={() => setOpen(false)}
        ref={testRef}
        launcherButtonRef={buttonRef}>
        {!minimalContent && (
          <div className={`${prefix}body-content`}>
            <h3 className={`${prefix}body-subheading`}>Section</h3>
            <div className={`${prefix}text-inputs`}>
              <TextInput
                labelText="Input A"
                id="side-panel-story-text-input-a"
                className={`${prefix}text-input`}
                disabled
              />
              <TextInput
                labelText="Input B"
                id="side-panel-story-text-input-b"
                className={`${prefix}text-input`}
              />
            </div>
            <div className={`${prefix}text-inputs`}>
              <TextInput
                labelText="Input C"
                id="side-panel-story-text-input-c"
                className={`${prefix}text-input`}
              />
              <TextInput
                labelText="Input D"
                id="side-panel-story-text-input-d"
                className={`${prefix}text-input`}
              />
            </div>
          </div>
        )}
      </SidePanel>
    </>
  );
};

const StepTemplate: StoryFn<StoryArgs> = (args, context) => {
  const [open, setOpen] = useState(context.viewMode !== 'docs');
  const [currentStep, setCurrentStep] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {renderTrigger({ open, setOpen, buttonRef, name: 'side panel' })}
      <SidePanel
        {...panelProps(args)}
        open={open}
        onRequestClose={() => setOpen(false)}
        currentStep={currentStep}
        onNavigationBack={() => setCurrentStep((prev) => prev - 1)}
        launcherButtonRef={buttonRef}>
        <ChildrenContentWithSteps
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </SidePanel>
    </>
  );
};

const SlideInTemplate: StoryFn<StoryArgs> = (args, context) => {
  const [open, setOpen] = useState(context.viewMode !== 'docs');
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <div className={`${prefix}story-content`} id="ibm-products-page-content">
        {renderTrigger({
          open,
          setOpen,
          buttonRef,
          name: 'side panel',
        })}
      </div>
      <SidePanel
        {...panelProps(args)}
        open={open}
        onRequestClose={() => setOpen(false)}
        launcherButtonRef={buttonRef}>
        <ChildrenContent />
      </SidePanel>
    </>
  );
};

export const SlideOver = SlideOverTemplate.bind({});
SlideOver.args = {
  includeOverlay: true,
  actions: 0,
  ...defaultStoryProps,
};

export const SlideIn = SlideInTemplate.bind({});
SlideIn.args = {
  slideIn: true,
  selectorPageContent: '#ibm-products-page-content',
  actions: 0,
  ...defaultStoryProps,
  labelText: 'Incident management',
};

SlideIn.argTypes = {
  jsFlags: {
    control: false,
    description: 'Not supported in this story',
  },
};

export const WithActionToolbar = SlideOverTemplate.bind({});
WithActionToolbar.args = {
  actionToolbarButtons: 3,
  ...defaultStoryProps,
};

export const PanelWithSecondStep = StepTemplate.bind({});
PanelWithSecondStep.args = {
  actions: 0,
  includeOverlay: true,
  currentStep: 1,
  ...defaultStoryProps,
};

export const WithAILabel = SlideOverTemplate.bind({});
WithAILabel.args = {
  includeOverlay: true,
  actions: 0,
  decorator: 1,
  ...defaultStoryProps,
};

export const SpecifyElementToHaveInitialFocus = SlideOverTemplate.bind({});
SpecifyElementToHaveInitialFocus.args = {
  actions: 0,
  selectorPrimaryFocus: '#side-panel-story-text-input-a',
  ...defaultStoryProps,
};

export const WithStaticTitle = SlideOverTemplate.bind({});
WithStaticTitle.args = {
  ...defaultStoryProps,
  actions: 0,
  animateTitle: false,
  includeOverlay: true,
};

export const FirstElementDisabled = FirstElementDisabledTemplate.bind({});
FirstElementDisabled.args = {
  ...defaultStoryProps,
  actions: 0,
  animateTitle: false,
  includeOverlay: true,
};

export const WithStaticTitleAndActionToolbar = SlideOverTemplate.bind({});
WithStaticTitleAndActionToolbar.args = {
  ...defaultStoryProps,
  actions: 0,
  animateTitle: false,
  includeOverlay: true,
  actionToolbarButtons: 3,
};

export const WithoutTitle = SlideOverTemplate.bind({});
WithoutTitle.args = {
  ...defaultStoryProps,
  actions: 0,
  title: null,
  subtitle: null,
  includeOverlay: true,
  'aria-label': 'SidePanel without title',
};
