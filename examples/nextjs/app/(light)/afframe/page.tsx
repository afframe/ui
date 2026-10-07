import {
  AccentTag,
  DescriptionList,
  DescriptionListItem,
  StatusIndicator,
  TextInput,
} from '@afframe/ui';
import { CreateModalDemo } from './create-modal-demo';

// A server component: StatusIndicator and DescriptionList are server-safe, and
// AccentTag (a client component) gets serializable props only. The function
// props of the create flow live in the 'use client' demo next to this page.
export default function AfframePage() {
  return (
    <main style={{ padding: 'var(--cds-spacing-07)' }}>
      <h1>Afframe components</h1>
      <TextInput id="project" labelText="Project" />
      <StatusIndicator kind="succeeded" label="Deployed" />
      <StatusIndicator kind="in-progress" appearance="tag" />
      <StatusIndicator kind="failed" compact />
      <DescriptionList aria-label="Project details">
        <DescriptionListItem term="Owner">Jane Doe</DescriptionListItem>
        <DescriptionListItem term="Region">Frankfurt</DescriptionListItem>
      </DescriptionList>
      <AccentTag text="Billing" accent="teal" tooltip="Billing team" />
      <CreateModalDemo />
    </main>
  );
}
