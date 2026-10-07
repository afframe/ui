/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui (ConditionBuilder is previewCandidate__ConditionBuilder), icons from @afframe/ui icons, title Components/ConditionBuilder, getEmptyState, deprecatedProps and the variant constants copied locally because @afframe/ui does not export them, uuidv4() replaced by crypto.randomUUID(), story styles converted from SCSS to plain CSS, duplicate commented-out import removed, em-dashes replaced, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Wikis } from '../../icons.js';
import {
  Button,
  ConditionBuilder,
  type ConditionBuilderProps,
  type ConditionBuilderState,
} from '../../index.js';
import mdx from './ConditionBuilder.mdx';
import './condition-builder-story.css';
import {
  inputData,
  inputDataDynamicOptions,
  inputDataForCustomOperator,
  inputDataWithDisabledProperties,
} from './assets/sampleInput.js';
import {
  sampleDataStructure_nonHierarchical,
  sampleDataStructure_Hierarchical,
  initialStateWithCustomOperators,
} from './assets/SampleData.js';

type Condition = { property?: string };

// The stories pass sample data that is looser than IBM's prop types.
type StoryArgs = Record<string, unknown>;

// Copied from IBM's ConditionBuilder/utils/util.js (not exported).
const NON_HIERARCHICAL_VARIANT = 'Non-Hierarchical';
const HIERARCHICAL_VARIANT = 'Hierarchical';

// The keys of IBM's deprecatedProps in ConditionBuilder.tsx (not exported).
const deprecatedProps = ['initialState', 'getConditionState'];

// Copied from IBM's ConditionBuilderProvider.tsx; @afframe/ui does not export
// getEmptyState.
const getEmptyState = (): ConditionBuilderState => ({
  operator: 'or',
  groups: [
    {
      groupOperator: 'and',
      statement: 'ifAll',
      id: crypto.randomUUID(),
      conditions: [
        {
          property: undefined,
          operator: '',
          value: '',
          popoverToOpen: 'propertyField',
          id: crypto.randomUUID(),
        },
      ],
    },
  ],
});

export default {
  title: 'Components/ConditionBuilder',
  component: ConditionBuilder,
  tags: ['ibm-products'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      page: mdx,
    },
  },

  argTypes: {
    // Deprecated props are kept visible in Storybook controls so adopters
    // can see the deprecation information. The @deprecated JSDoc on each
    // prop surfaces in the controls panel description.
    ...Object.fromEntries(
      deprecatedProps.map((key) => [key, { table: { category: 'deprecated' } }])
    ),
  },
} satisfies Meta<typeof ConditionBuilder>;

const getContinents = () => {
  return [
    {
      label: 'Africa',
      id: 'Africa',
    },
    {
      label: 'Antarctica',
      id: 'Antarctica',
    },
    {
      label: 'Asia',
      id: 'Asia',
    },
    {
      label: 'Australia',
      id: 'Australia',
    },
    {
      label: 'Europe',
      id: 'Europe',
    },
  ];
};

const getRegions = () => {
  return [
    {
      label: 'Afghanistan',
      id: 'AF',
      icon: Wikis,
    },
    {
      label: 'Albania',
      id: 'AL',
      icon: Wikis,
    },
    {
      label: 'Algeria',
      id: 'AG',
      icon: Wikis,
    },
    {
      label: 'Andorra',
      id: 'AN',
      icon: Wikis,
    },
  ];
};

const getColors = () => {
  return [
    {
      label: 'black',
      id: 'black',
    },
    {
      label: 'silver',
      id: 'silver',
    },
    {
      label: 'gray',
      id: 'gray',
    },
    {
      label: 'white',
      id: 'white',
    },
    {
      label: 'maroon',
      id: 'maroon',
    },
    {
      label: 'red',
      id: 'red',
    },
    {
      label: 'purple',
      id: 'purple',
    },
    {
      label: 'fuchsia',
      id: 'fuchsia',
    },
    {
      label: 'green',
      id: 'green',
    },
    {
      label: 'lime',
      id: 'lime',
    },
    {
      label: 'olive',
      id: 'olive',
    },
    {
      label: 'yellow',
      id: 'yellow',
    },
    {
      label: 'navy',
      id: 'navy',
    },
    {
      label: 'blue',
      id: 'blue',
    },
    {
      label: 'teal',
      id: 'teal',
    },
    {
      label: 'aqua',
      id: 'aqua',
    },
  ];
};

const getOptions = async (
  conditionState: ConditionBuilderState,
  { property }: Condition
) => {
  switch (property) {
    case 'continent':
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getContinents());
        }, 2000);
      });
    case 'region':
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getRegions());
        }, 2000);
      });
    case 'color':
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getColors());
        }, 2000);
      });
    default:
      return [];
  }
};
const requiredProps = {
  startConditionLabel: 'Add condition',
  popOverSearchThreshold: 4,
  getConditionState: (rootState: ConditionBuilderState | undefined) => {
    console.log(rootState);
  },
};

const actions = [
  {
    id: crypto.randomUUID(),
    label: 'Add item to cart',
  },
  { id: crypto.randomUUID(), label: 'Proceed item to checkout' },
];

const translateWithId = (key: string) => {
  const translationsObject: Record<string, string> = {
    ifText: 'if',
    addConditionText: 'Add condition',
    addConditionGroupText: 'Add condition group',
    addSubgroupText: 'Add subgroup',
  };

  return translationsObject[key];
};
/**
 * TODO: Declare template(s) for one or more scenarios.
 */

const ConditionBuilderTemplate: StoryFn<StoryArgs> = (args) => {
  const ref = useRef<HTMLDivElement>(null);
  const descriptionId = 'condition-builder-a11y-desc';
  return (
    <>
      {/* Visually hidden description for screen reader users.
          Consumers should provide context-specific text that names the
          available properties and explains the keyboard interaction model. */}
      <p id={descriptionId} className="cds--visually-hidden">
        Use this builder to create filter conditions. Each condition has three
        parts: a property (what to filter on), an operator (how to compare), and
        a value. Use arrow keys to navigate between conditions and cells. Press
        Enter or Space to open a selector. Press Escape to close a selector
        without saving.
      </p>
      <ConditionBuilder
        {...(args as unknown as ConditionBuilderProps)}
        ref={ref}
        {...requiredProps}
        aria-describedby={descriptionId}
        onAddItem={(type: unknown) =>
          action(`onAddItem is triggered , type: ${type}`)()
        }
        onRemoveItem={(config: { type?: string }) =>
          action(`onRemoveItem is triggered , type: ${config?.type}`)(config)
        }
      />
    </>
  );
};

/**
 * TODO: Declare one or more stories, generally one per design scenario.
 * NB no need for a 'Playground' because all stories have all controls anyway.
 */
const statementConfigCustom = [
  {
    id: 'if',
    connector: 'and',
    label: 'if',
  },
  {
    id: 'exclIf',
    connector: 'or',
    label: 'excl. if',
  },
];

export const conditionBuilder = ConditionBuilderTemplate.bind({});
conditionBuilder.storyName = 'Condition Builder';
conditionBuilder.args = {
  inputConfig: inputData,
  variant: NON_HIERARCHICAL_VARIANT,
};

export const conditionBuilderDynamicOptions = ConditionBuilderTemplate.bind({});
conditionBuilderDynamicOptions.storyName = 'With dynamic options';
conditionBuilderDynamicOptions.args = {
  inputConfig: inputDataDynamicOptions,
  getOptions: getOptions,
  variant: NON_HIERARCHICAL_VARIANT,
};

export const conditionBuilderWithInitialState = ConditionBuilderTemplate.bind(
  {}
);
conditionBuilderWithInitialState.storyName = 'With initial state';
conditionBuilderWithInitialState.args = {
  value: sampleDataStructure_nonHierarchical,
  inputConfig: inputData,
  variant: NON_HIERARCHICAL_VARIANT,
  translateWithId: translateWithId,
};

export const conditionBuilderWithCustomStatements =
  ConditionBuilderTemplate.bind({});
conditionBuilderWithCustomStatements.storyName =
  'With Custom statement configuration';
conditionBuilderWithCustomStatements.args = {
  inputConfig: inputData,
  variant: NON_HIERARCHICAL_VARIANT,
  translateWithId: translateWithId,
  statementConfigCustom: statementConfigCustom,
};

export const conditionBuilderWithCustomOperators =
  ConditionBuilderTemplate.bind({});
conditionBuilderWithCustomOperators.storyName =
  'With Custom operator configuration';
conditionBuilderWithCustomOperators.args = {
  value: initialStateWithCustomOperators,
  inputConfig: inputDataForCustomOperator,
  variant: NON_HIERARCHICAL_VARIANT,
  translateWithId: translateWithId,
};

export const conditionBuilderWithDisabledProperties =
  ConditionBuilderTemplate.bind({});
conditionBuilderWithDisabledProperties.storyName = 'With disabled properties';
conditionBuilderWithDisabledProperties.args = {
  inputConfig: inputDataWithDisabledProperties,

  variant: NON_HIERARCHICAL_VARIANT,
};

export const conditionBuilderWithActions = ConditionBuilderTemplate.bind({});
conditionBuilderWithActions.storyName = 'With Actions';
conditionBuilderWithActions.args = {
  inputConfig: inputData,
  variant: NON_HIERARCHICAL_VARIANT,
  actions: actions,
  getActionsState: (actionState: unknown) => {
    console.log('action state', actionState);
  },
};

export const conditionBuilderHierarchical = ConditionBuilderTemplate.bind({});
conditionBuilderHierarchical.storyName = 'Condition Builder (Hierarchical)';
conditionBuilderHierarchical.args = {
  inputConfig: inputData,
  variant: HIERARCHICAL_VARIANT,
};
export const conditionBuilderWithInitialStateHierarchical =
  ConditionBuilderTemplate.bind({});
conditionBuilderWithInitialStateHierarchical.storyName =
  'With initial state (Hierarchical)';
conditionBuilderWithInitialStateHierarchical.args = {
  value: sampleDataStructure_Hierarchical,
  startActive: false,
  inputConfig: inputData,
  variant: HIERARCHICAL_VARIANT,
};

export const conditionBuilderWithActionsHierarchical =
  ConditionBuilderTemplate.bind({});
conditionBuilderWithActionsHierarchical.storyName =
  'With Actions (Hierarchical)';
conditionBuilderWithActionsHierarchical.args = {
  inputConfig: inputData,
  variant: HIERARCHICAL_VARIANT,
  actions: actions,
  getActionsState: () => {},
};

// An alternative state used by the "Update conditions" button below.
const alternativeState: ConditionBuilderState = {
  operator: 'and',
  groups: [
    {
      groupOperator: 'or',
      statement: 'ifAny',
      id: 'alt-group-1',
      conditions: [
        {
          property: 'continent',
          operator: 'is',
          value: { label: 'Europe', id: 'Europe' },
          id: 'alt-cond-1',
        },
        {
          property: 'region',
          operator: 'is',
          value: { label: 'Albania', id: 'AL' },
          id: 'alt-cond-2',
        },
      ],
    },
  ],
};

// Controlled mode story: demonstrates value + onChange with Hierarchical variant.
// Use the buttons to reset or swap the state from outside the builder.
const ControlledHierarchicalTemplate: StoryFn<StoryArgs> = () => {
  const descriptionId = 'controlled-hierarchical-a11y-desc';
  const [conditionState, setConditionState] = useState<ConditionBuilderState>(
    sampleDataStructure_Hierarchical
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* External controls: demonstrate driving value from outside */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          kind="secondary"
          size="sm"
          onClick={() => setConditionState(getEmptyState())}>
          Reset conditions
        </Button>
        <Button
          kind="primary"
          size="sm"
          onClick={() => setConditionState(alternativeState)}>
          Update conditions
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 60%' }}>
          <p id={descriptionId} className="cds--visually-hidden">
            Use this builder to create filter conditions. Each condition has
            three parts: a property, an operator, and a value. Use arrow keys to
            navigate between conditions. Press Enter or Space to open a
            selector. Press Escape to close without saving.
          </p>
          <ConditionBuilder
            inputConfig={inputData as ConditionBuilderProps['inputConfig']}
            variant={HIERARCHICAL_VARIANT}
            popOverSearchThreshold={4}
            aria-describedby={descriptionId}
            value={conditionState}
            onChange={(newState) => {
              setConditionState(newState);
            }}
          />
        </div>
        <div
          style={{
            flex: '1 1 40%',
            background: 'var(--cds-layer)',
            padding: '1rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            overflowX: 'auto',
            whiteSpace: 'pre',
          }}>
          <strong style={{ fontFamily: 'sans-serif', fontSize: '13px' }}>
            Live condition state (value prop)
          </strong>
          <br />
          <br />
          {JSON.stringify(conditionState, null, 2)}
        </div>
      </div>
    </div>
  );
};

export const conditionBuilderControlledHierarchical =
  ControlledHierarchicalTemplate.bind({});
conditionBuilderControlledHierarchical.storyName =
  'Controlled mode: value + onChange (Hierarchical)';
// IBM's hierarchical groups render rowgroup and row roles without the
// required children.
conditionBuilderControlledHierarchical.parameters = {
  a11y: {
    config: { rules: [{ id: 'aria-required-children', enabled: false }] },
  },
};
