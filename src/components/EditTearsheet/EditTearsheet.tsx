'use client';
import { WarningFilled } from '@carbon/icons-react';
import { preview__Tearsheet as Tearsheet } from '@carbon/ibm-products';
import { InlineLoading } from '@carbon/react';
import { Children, isValidElement, useEffect, useState } from 'react';
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import { resolveMessages } from '../../messages.js';
import { DiscardDialog, FlowError, FlowForm } from '../FlowParts/FlowParts.js';
import { defaultFormFlowMessages } from '../FlowParts/messages.js';
import type { DiscardMessages, FlowMessages } from '../FlowParts/messages.js';
import type { ModalRootAttribute } from '../FlowParts/refs.js';
import { useFlow } from '../FlowParts/useFlow.js';

export interface EditTearsheetMessages extends FlowMessages, DiscardMessages {
  /** Primary button. */
  save: string;
  /** Name of the side navigation that lists the forms. */
  sectionsNavLabel: string;
  /** Accessible name of the error icon on an invalid form's nav item. */
  sectionInvalid: (title: string) => string;
}

export const defaultEditTearsheetMessages: EditTearsheetMessages = {
  ...defaultFormFlowMessages,
  save: 'Save',
  sectionsNavLabel: 'Sections',
  sectionInvalid: (title) => `${title} has errors`,
};

export interface EditTearsheetFormProps {
  /** Unique in the page; the nav item scrolls to the form with this id. */
  id: string;
  title: string;
  description?: ReactNode;
  /** Marks the nav item with an error icon; Save then focuses this form. */
  invalid?: boolean;
  children?: ReactNode;
}

/** One form (section) of an EditTearsheet, listed in its side navigation. */
export function EditTearsheetForm({
  id,
  title,
  description,
  children,
}: EditTearsheetFormProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="afframe-edit-tearsheet-form">
      <h3
        id={`${id}-title`}
        tabIndex={-1}
        className="afframe-edit-tearsheet-form-title">
        {title}
      </h3>
      {description && (
        <p className="afframe-edit-tearsheet-form-description">{description}</p>
      )}
      <div className="afframe-edit-tearsheet-form-fields">{children}</div>
    </section>
  );
}

interface EditTearsheetOwnProps {
  open: boolean;
  /** Called after a successful submit, Discard, or a close of a clean form. */
  onClose: () => void;
  /** A returned promise keeps the tearsheet busy until it settles. */
  onSubmit: () => void | Promise<void>;
  title: string;
  description?: ReactNode;
  /** Small text above the title. */
  label?: ReactNode;
  /** Width of the side navigation. Default `narrow`. */
  influencerWidth?: 'narrow' | 'wide';
  /** Called with the index of the form chosen in the side navigation. */
  onFormChange?: (index: number) => void;
  submitDisabled?: boolean;
  isDirty?: boolean;
  /** Ask before discarding a dirty form. Default true. */
  confirmDiscard?: boolean;
  /** Focus target on close; default the element focused before opening. */
  launcherRef?: RefObject<HTMLElement | null>;
  messages?: Partial<EditTearsheetMessages>;
  /** The forms: `EditTearsheetForm` elements. */
  children?: ReactNode;
  className?: string;
}

/**
 * The rest go to the tearsheet's root `div` (Carbon ComposedModal's), which
 * IBM names itself.
 */
export interface EditTearsheetProps
  extends
    EditTearsheetOwnProps,
    Omit<
      HTMLAttributes<HTMLDivElement>,
      keyof EditTearsheetOwnProps | ModalRootAttribute | 'aria-labelledby'
    > {
  /** The tearsheet's root `div`; null while closed. */
  ref?: Ref<HTMLDivElement> | undefined;
}

const influencerWidths = { narrow: '16rem', wide: '20rem' } as const;

function focusForm(id: string) {
  const heading = document.getElementById(`${id}-title`);
  heading?.scrollIntoView({ block: 'start' });
  heading?.focus();
}

/** A multi-form edit in IBM's tearsheet, with a side navigation of the forms. Controlled by `open`. */
export function EditTearsheet({
  open,
  onClose,
  onSubmit,
  title,
  description,
  label,
  influencerWidth = 'narrow',
  onFormChange,
  submitDisabled = false,
  isDirty = false,
  confirmDiscard = true,
  launcherRef,
  messages,
  children,
  className,
  ...rest
}: EditTearsheetProps) {
  const text = resolveMessages(defaultEditTearsheetMessages, messages);
  const [current, setCurrent] = useState(0);
  const flow = useFlow<HTMLFormElement>({
    open,
    onClose,
    isDirty,
    confirmDiscard,
    launcherRef,
    messages: { error: text.error, errorText: text.errorText },
  });

  // Only EditTearsheetForm children are rendered and listed.
  const all = Children.toArray(children);
  const formElements = all.filter(
    (child): child is ReactElement<EditTearsheetFormProps> =>
      isValidElement(child) && child.type === EditTearsheetForm
  );
  const forms = formElements.map((child) => child.props);
  const ignored = all.length - formElements.length;
  useEffect(() => {
    if (ignored > 0)
      console.warn(
        `EditTearsheet: ${ignored} child element(s) that are not EditTearsheetForm are ignored.`
      );
  }, [ignored]);

  // Each open starts on the first form; the index stays in range.
  useEffect(() => {
    if (open) setCurrent(0);
  }, [open]);
  const active = Math.min(current, forms.length - 1);

  const select = (index: number) => {
    const form = forms[index];
    if (!form) return;
    setCurrent(index);
    focusForm(form.id);
    onFormChange?.(index);
  };

  // Save stays enabled with invalid forms; it focuses the first one instead.
  const submit = async () => {
    const invalid = forms.findIndex((form) => form.invalid);
    if (invalid >= 0) select(invalid);
    else if (await flow.run(onSubmit)) flow.close();
  };

  const actions = [
    {
      kind: 'secondary' as const,
      label: text.cancel,
      disabled: flow.pending,
      onClick: flow.requestClose,
    },
    {
      kind: 'primary' as const,
      // Cast kept: ActionSet types `label` as a string but renders any node
      // as the button content. Its own `loading` flag adds an InlineLoading
      // with no text and an English icon name, so the label carries ours.
      label: (flow.pending ? (
        <InlineLoading
          description={text.pending}
          iconDescription={text.pending}
        />
      ) : (
        text.save
      )) as unknown as string,
      disabled: submitDisabled || flow.pending,
      onClick: () => void submit(),
    },
  ];

  return (
    <>
      <Tearsheet
        {...rest}
        open={open}
        // false: ComposedModal would otherwise close itself, while the
        // flow may keep it open (dirty, submitting).
        onClose={() => {
          flow.requestClose();
          return false;
        }}
        preventCloseOnClickOutside
        influencerWidth={influencerWidths[influencerWidth]}
        className={['afframe-edit-tearsheet', className]
          .filter(Boolean)
          .join(' ')}>
        <Tearsheet.Header
          closeIconDescription={text.closeIconDescription}
          // Reaches Carbon's ModalHeader, whose hidden close button is named too.
          {...{ iconDescription: text.closeIconDescription }}>
          <Tearsheet.HeaderContent
            title={title}
            {...(label ? { label } : {})}
            {...(description ? { description } : {})}
          />
        </Tearsheet.Header>
        <Tearsheet.Influencer influencerPanelAriaLabel={text.sectionsNavLabel}>
          <nav
            aria-label={text.sectionsNavLabel}
            className="afframe-edit-tearsheet-nav">
            <ul>
              {forms.map((form, index) => (
                <li key={form.id}>
                  <button
                    type="button"
                    className="afframe-edit-tearsheet-nav-item"
                    aria-current={index === active ? 'true' : undefined}
                    onClick={() => select(index)}>
                    <span>{form.title}</span>
                    {form.invalid && (
                      <WarningFilled
                        role="img"
                        aria-hidden={false}
                        aria-label={text.sectionInvalid(form.title)}
                        className="afframe-edit-tearsheet-nav-invalid"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Tearsheet.Influencer>
        <Tearsheet.Body>
          <Tearsheet.MainContent>
            <FlowForm
              flow={flow}
              onSubmit={() => void submit()}
              submitDisabled={submitDisabled}
              aria-label={title}>
              {formElements}
              <FlowError
                error={flow.error}
                iconDescription={text.errorIconDescription}
              />
            </FlowForm>
          </Tearsheet.MainContent>
        </Tearsheet.Body>
        <Tearsheet.Footer actions={actions} />
      </Tearsheet>
      <DiscardDialog flow={flow} messages={text} />
    </>
  );
}
