/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui (preview__Dialog), source tag, the onRequestClose action is now called (upstream only created it), stray space in a Toggle open label removed, ModalFocusAndClose story (hidden from the sidebar and docs) with a play test for initial focus, the Close button and the Escape close request, story names unified, Default with neutral business data and open state synced on Escape, Passive and Danger story names. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, waitFor, within } from 'storybook/test';
import {
  Button,
  preview__Dialog,
  Select,
  SelectItem,
  TextInput,
  VStack,
} from '../../index.js';
import type { DialogProps } from '../../index.js';
import mdx from './Dialog.mdx';

const {
  Dialog,
  DialogControls,
  DialogCloseButton,
  DialogBody,
  DialogHeader,
  DialogSubtitle,
  DialogTitle,
  DialogFooter,
} = preview__Dialog;

export default {
  title: 'Preview/preview__Dialog',
  component: Dialog,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: [
        'hasScrollingContent',
        'modal',
        'open',
        'focusAfterCloseRef',
        'ariaDescribedBy',
        'ariaLabelledBy',
      ],
    },
  },
} satisfies Meta<typeof Dialog>;

export const Default: StoryFn<DialogProps> = ({ open: _open, ...args }) => {
  const [open, setOpen] = useState(_open ?? false);

  function toggleDialog() {
    setOpen(!open);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleRequestClose(event: SyntheticEvent) {
    action('Dialog onRequestClose')(event);
    closeDialog();
  }

  useEffect(() => {
    setOpen(_open ?? false);
  }, [_open]);

  return (
    <>
      <Button type="button" onClick={toggleDialog}>
        Toggle open
      </Button>
      {/* Escape closes the native dialog without onRequestClose. */}
      <Dialog
        {...args}
        open={open}
        onRequestClose={handleRequestClose}
        onClose={closeDialog}>
        <DialogHeader>
          <DialogSubtitle>Suppliers</DialogSubtitle>
          <DialogTitle id="title">Edit supplier</DialogTitle>
          <DialogControls>
            <DialogCloseButton onClick={closeDialog} />
          </DialogControls>
        </DialogHeader>
        <DialogBody>
          <VStack>
            <p>
              Changes apply to new purchase orders. Orders already sent keep the
              details they were sent with.
            </p>
            <p>
              Payment terms set the due date of incoming invoices from this
              supplier. Reminders go out three days before the due date.
            </p>
            <TextInput
              id="dialog-text-input"
              labelText="Company name"
              placeholder="For example, Northwind Supplies Ltd"
            />
            <Select
              id="dialog-select"
              labelText="Payment terms"
              defaultValue="30">
              <SelectItem value="14" text="14 days" />
              <SelectItem value="30" text="30 days" />
            </Select>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button type="button" kind="secondary" onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="button" kind="primary" onClick={closeDialog}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
Default.args = {
  modal: true,
  open: true,
};

export const NonModal: StoryFn<DialogProps> = ({ open: _open, ...args }) => {
  const [open, setOpen] = useState(_open ?? false);

  function toggleDialog() {
    setOpen(!open);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleRequestClose(event: SyntheticEvent) {
    action('Dialog onRequestClose')(event);
    closeDialog();
  }

  useEffect(() => {
    setOpen(_open ?? false);
  }, [_open]);

  return (
    <>
      <Button type="button" onClick={toggleDialog}>
        Toggle open
      </Button>
      <Dialog {...args} open={open} onRequestClose={handleRequestClose}>
        <DialogHeader>
          <DialogSubtitle>Non-modal dialog example Subtitle</DialogSubtitle>
          <DialogTitle>Non-Modal Dialog</DialogTitle>
          <DialogControls>
            <DialogCloseButton onClick={closeDialog} />
          </DialogControls>
        </DialogHeader>
        <DialogBody>
          <p>
            Elit hic at labore culpa itaque fugiat. Consequuntur iure autem
            autem officiis dolores facilis nulla earum! Neque quia nemo sequi
            assumenda ratione officia Voluptate beatae eligendi placeat nemo
            laborum, ratione.
          </p>
          <TextInput
            id="dialog-text-input"
            labelText="Name"
            placeholder="Enter your name"
          />
          <Select id="dialog-select" labelText="Region" defaultValue="us-south">
            <SelectItem value="us-south" text="US South" />
            <SelectItem value="us-east" text="US East" />
          </Select>
          <p>
            Elit hic at labore culpa itaque fugiat. Consequuntur iure autem
            autem officiis dolores facilis nulla earum! Neque quia nemo sequi
            assumenda ratione officia Voluptate beatae eligendi placeat nemo
            laborum, ratione.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button type="button" kind="secondary" onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="button" kind="primary" onClick={closeDialog}>
            Submit
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
NonModal.args = {
  modal: false,
  open: true,
};

export const WithScrollingContent: StoryFn<DialogProps> = ({
  open: _open,
  ...args
}) => {
  const [open, setOpen] = useState(_open ?? false);

  function toggleDialog() {
    setOpen(!open);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleRequestClose(event: SyntheticEvent) {
    action('Dialog onRequestClose')(event);
    closeDialog();
  }

  useEffect(() => {
    setOpen(_open ?? false);
  }, [_open]);

  return (
    <>
      <Button type="button" onClick={toggleDialog}>
        Toggle open
      </Button>
      <Dialog {...args} open={open} onRequestClose={handleRequestClose}>
        <DialogHeader>
          <DialogSubtitle>Configure dialog settings</DialogSubtitle>
          <DialogTitle>Modal Dialog Example</DialogTitle>
          <DialogControls>
            <DialogCloseButton onClick={closeDialog} />
          </DialogControls>
        </DialogHeader>
        <DialogBody hasScrollingContent>
          <VStack>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              eu nibh odio. Nunc a consequat est, id porttitor sapien. Proin
              vitae leo vitae orci tincidunt auctor eget eget libero. Ut
              tincidunt ultricies fringilla. Aliquam erat volutpat. Aenean arcu
              odio, elementum vel vehicula vitae, porttitor ac lorem. Sed
              viverra elit ac risus tincidunt fermentum. Ut sollicitudin nibh id
              risus ornare ornare. Etiam gravida orci ut lectus dictum, quis
              ultricies felis mollis. Mauris nec commodo est, nec faucibus nibh.
              Nunc commodo ante quis pretium consectetur. Ut ac nisl vitae mi
              mattis vulputate a at elit. Nullam porttitor ex eget mi feugiat
              mattis. Nunc non sodales magna. Proin ornare tellus quis hendrerit
              egestas. Donec pharetra leo nec molestie sollicitudin.
            </p>
            <TextInput
              id="dialog-text-input"
              labelText="Name"
              placeholder="Enter your name"
            />
            <Select
              id="dialog-select"
              labelText="Region"
              defaultValue="us-south">
              <SelectItem value="us-south" text="US South" />
              <SelectItem value="us-east" text="US East" />
            </Select>
            <p>
              Elit hic at labore culpa itaque fugiat. Consequuntur iure autem
              autem officiis dolores facilis nulla earum! Neque quia nemo sequi
              assumenda ratione officia Voluptate beatae eligendi placeat nemo
              laborum, ratione.
            </p>
            <p>
              Elit hic at labore culpa itaque fugiat. Consequuntur iure autem
              autem officiis dolores facilis nulla earum! Neque quia nemo sequi
              assumenda ratione officia Voluptate beatae eligendi placeat nemo
              laborum, ratione.
            </p>
            <TextInput
              id="dialog-text-input"
              labelText="Name"
              placeholder="Enter your name"
            />
            <Select
              id="dialog-select"
              labelText="Region"
              defaultValue="us-south">
              <SelectItem value="us-south" text="US South" />
              <SelectItem value="us-east" text="US East" />
            </Select>
            <p>
              Elit hic at labore culpa itaque fugiat. Consequuntur iure autem
              autem officiis dolores facilis nulla earum! Neque quia nemo sequi
              assumenda ratione officia Voluptate beatae eligendi placeat nemo
              laborum, ratione.
            </p>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button type="button" kind="secondary" onClick={closeDialog}>
            Close
          </Button>
          <Button type="button" kind="primary" onClick={closeDialog}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
WithScrollingContent.args = {
  modal: true,
  open: true,
};

export const Passive: StoryFn<DialogProps> = ({ open: _open, ...args }) => {
  const [open, setOpen] = useState(_open ?? false);

  function toggleDialog() {
    setOpen(!open);
  }

  function closeDialog() {
    setOpen(false);
  }

  function handleRequestClose(event: SyntheticEvent) {
    action('Dialog onRequestClose')(event);
    closeDialog();
  }

  useEffect(() => {
    setOpen(_open ?? false);
  }, [_open]);

  return (
    <>
      <Button type="button" onClick={toggleDialog}>
        Toggle open
      </Button>
      <Dialog {...args} open={open} modal onRequestClose={handleRequestClose}>
        <DialogHeader>
          <DialogTitle>Information Message</DialogTitle>
          <DialogControls>
            <DialogCloseButton onClick={closeDialog} />
          </DialogControls>
        </DialogHeader>
        <DialogBody>
          <p>You have been successfully signed out</p>
        </DialogBody>
      </Dialog>
    </>
  );
};

export const Danger: StoryFn<DialogProps> = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Toggle open</Button>
      <Dialog {...args} open={open} onRequestClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogSubtitle>Account resources</DialogSubtitle>
          <DialogTitle>
            Are you sure you want to delete this custom domain?
          </DialogTitle>
          <DialogControls>
            <DialogCloseButton onClick={() => setOpen(false)} />
          </DialogControls>
        </DialogHeader>
        <DialogBody></DialogBody>
        <DialogFooter
          danger
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          onRequestClose={() => setOpen(false)}
          onRequestSubmit={() => {
            setOpen(false);
          }}
        />
      </Dialog>
    </>
  );
};

Danger.args = {
  modal: true,
};

// Documents the current behaviour; Afframe does not change it. Kept out of the
// sidebar and docs so the Default story stays as upstream ships it.
export const ModalFocusAndClose: StoryFn<DialogProps> = Default.bind({});
ModalFocusAndClose.args = { ...Default.args };
ModalFocusAndClose.tags = ['!dev', '!autodocs'];
ModalFocusAndClose.play = async ({ canvas, userEvent }) => {
  const dialog = canvas.getByRole<HTMLDialogElement>('dialog');
  const toggle = canvas.getByRole('button', { name: 'Toggle open' });
  const close = () => within(dialog).getByRole('button', { name: 'Close' });
  // onClose runs on the close event, which fires after `open` is gone; a
  // reopen before it lets that late onClose close the new dialog.
  const closed = () =>
    new Promise((resolve) =>
      dialog.addEventListener('close', resolve, { once: true })
    );

  await waitFor(() => expect(close()).toHaveFocus());
  let done = closed();
  await userEvent.click(close());
  await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
  await done;

  await userEvent.click(toggle);
  await waitFor(() => expect(close()).toHaveFocus());
  // A user-event Escape is untrusted, so the browser ignores it. requestClose()
  // runs the close request a real Escape starts: the native dialog closes and
  // focus returns to the opener. onClose syncs the story's open state, so one
  // toggle reopens it.
  done = closed();
  dialog.requestClose();
  await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
  await done;
  await expect(toggle).toHaveFocus();
  await userEvent.click(toggle);
  await waitFor(() => expect(dialog).toHaveAttribute('open'));
};
