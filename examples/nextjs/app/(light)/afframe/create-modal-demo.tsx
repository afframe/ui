'use client';
import { Button, CreateModal, TextInput } from '@afframe/ui';
import { useState } from 'react';

// CreateModal takes onClose and onSubmit, so its launcher is a client file.
export function CreateModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>New project</Button>
      <CreateModal
        open={open}
        title="New project"
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}>
        <TextInput id="new-project-name" labelText="Name" />
      </CreateModal>
    </>
  );
}
