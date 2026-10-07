/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, the inner FeatureFlags wrapper, feature flag annotation and ClassPrefix wrapper removed (Afframe turns the flags on globally and its styles compile them), story stylesheet dropped, source tag, autofocus="true" written as autoFocus, inline spacing as Carbon spacing tokens, enable-focus-wrap-without-sentinels story removed (the flag has no effect with the dialog element). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  Button,
  Dropdown,
  Modal,
  MultiSelect,
  Select,
  SelectItem,
  TextInput,
} from '../../index.js';

export default {
  title: 'Components/Modal/Feature Flags',
  component: Modal,
  tags: ['carbon', '!autodocs'],
  parameters: {
    controls: {
      exclude: ['launcherButtonRef'],
    },
  },
} satisfies Meta<typeof Modal>;

export const EnableDialogElement: StoryFn<typeof Modal> = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Launch modal</Button>
      <Modal
        open={open}
        onRequestClose={() => setOpen(false)}
        modalHeading="Add a custom domain"
        modalLabel="Account resources"
        primaryButtonText="Add"
        secondaryButtonText="Cancel">
        <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </p>
        <TextInput
          autoFocus
          id="text-input-1"
          labelText="Domain name"
          placeholder="e.g. github.com"
          style={{ marginBottom: 'var(--cds-spacing-05)' }}
        />
        <Select id="select-1" defaultValue="us-south" labelText="Region">
          <SelectItem value="us-south" text="US South" />
          <SelectItem value="us-east" text="US East" />
        </Select>
        <Dropdown
          id="drop"
          label="Dropdown"
          titleText="Dropdown"
          items={[
            { id: 'one', label: 'one', name: 'one' },
            { id: 'two', label: 'two', name: 'two' },
          ]}
        />
        <MultiSelect
          id="test"
          label="Multiselect"
          titleText="Multiselect"
          items={[
            {
              id: 'downshift-1-item-0',
              text: 'Option 1',
            },
            {
              id: 'downshift-1-item-1',
              text: 'Option 2',
            },
          ]}
          itemToString={(item) => (item ? item.text : '')}
        />
      </Modal>
    </>
  );
};
EnableDialogElement.storyName = 'enable-dialog-element';
