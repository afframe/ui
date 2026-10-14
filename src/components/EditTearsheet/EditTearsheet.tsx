'use client';
import { RightPanelClose, WarningFilled } from '@carbon/icons-react';
import { preview__Tearsheet as Tearsheet } from '@carbon/ibm-products';
import {
  Button,
  Column,
  Grid,
  SideNav,
  SideNavItems,
  SideNavMenuItem,
} from '@carbon/react';
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import { resolveMessages } from '../../messages.js';
import {
  DiscardDialog,
  FlowButtonLabel,
  FlowError,
  FlowForm,
  FlowStatus,
} from '../FlowParts/FlowParts.js';
import { defaultFormFlowMessages } from '../FlowParts/messages.js';
import type { DiscardMessages, FlowMessages } from '../FlowParts/messages.js';
import type { ModalRootAttribute } from '../FlowParts/refs.js';
import { firstControlSelector, useFlow } from '../FlowParts/useFlow.js';

export interface EditTearsheetMessages extends FlowMessages, DiscardMessages {
  /** Primary button. */
  save: string;
  /** Name of the side navigation that lists the forms. */
  sectionsNavLabel: string;
  /** Accessible name of the error icon on an invalid form's nav item. */
  sectionInvalid: (title: string) => string;
  /** Button that opens the side navigation on small screens and in `narrow`. */
  openSections: string;
}

export const defaultEditTearsheetMessages: EditTearsheetMessages = {
  ...defaultFormFlowMessages,
  save: 'Save',
  sectionsNavLabel: 'Sections',
  sectionInvalid: (title) => `${title} has errors`,
  openSections: 'Open sections',
};

export interface EditTearsheetFormProps {
  /** Unique in the page; the nav item links to the form with this id. */
  id: string;
  title: string;
  description?: ReactNode;
  /** Marks the nav item with an error icon; Save then shows and focuses this form. */
  invalid?: boolean;
  children?: ReactNode;
}

// IBM's EditTearsheet class names: its compiled styles hide the other forms,
// fade the shown one in, and set the content padding and grid margins.
const ibm = 'c4p--tearsheet-edit';

interface FormContextValue {
  activeId: string | undefined;
  narrow: boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

/** One form of an EditTearsheet, listed in its side navigation; one is shown at a time. */
export function EditTearsheetForm({
  id,
  title,
  description,
  children,
}: EditTearsheetFormProps) {
  const context = useContext(FormContext);
  const visible = !context || context.activeId === id;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={[
        `${ibm}__form`,
        `${ibm}__form__form--${visible ? 'visible' : 'hidden'}-form`,
        'afframe-edit-tearsheet-form',
      ].join(' ')}>
      <Grid>
        <Column sm={4} md={8} lg={context?.narrow ? 16 : 12}>
          {/* IBM's is an h4; an h3 under the tearsheet's h2 keeps the
              heading order, styled as IBM's h4. */}
          <h3
            id={`${id}-title`}
            tabIndex={-1}
            className={`${ibm}__form--title afframe-edit-tearsheet-form-title`}>
            {title}
          </h3>
          {description && (
            <p className={`${ibm}__form--description`}>{description}</p>
          )}
        </Column>
        <Column
          sm={4}
          md={8}
          lg={context?.narrow ? 16 : 8}
          className="afframe-edit-tearsheet-form-fields">
          {children}
        </Column>
      </Grid>
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
  /** `wide` (default) or `narrow` (480px); narrow keeps the side navigation in a panel. */
  variant?: 'wide' | 'narrow';
  /** IBM's `Tearsheet.HeaderActions` with `Tearsheet.HeaderActionItem`s, beside the title. */
  headerActions?: ReactNode;
  /** An AI label or another decorator in the header. */
  decorator?: ReactNode;
  /** Width of the side navigation. Default `narrow`. */
  influencerWidth?: 'narrow' | 'wide';
  /** Called with the index of the form chosen in the side navigation. */
  onFormChange?: (index: number) => void;
  submitDisabled?: boolean;
  isDirty?: boolean;
  /** Ask before discarding a dirty form or a pending submit. Default true. */
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

// IBM's tearsheet turns the influencer into a side panel at this width.
const smallQuery = '(max-width: 42rem)';

function subscribeSmallScreen(onChange: () => void) {
  const list = window.matchMedia(smallQuery);
  list.addEventListener('change', onChange);
  return () => list.removeEventListener('change', onChange);
}

const isSmallScreen = () => window.matchMedia(smallQuery).matches;
const isSmallScreenOnServer = () => false;

function useSmallScreen(): boolean {
  return useSyncExternalStore(
    subscribeSmallScreen,
    isSmallScreen,
    isSmallScreenOnServer
  );
}

const visibleForm = `.${ibm}__form__form--visible-form`;
const firstVisibleControl = firstControlSelector
  .split(', ')
  .map((selector) => `${visibleForm} ${selector}`)
  .join(', ');

/** A multi-form edit in IBM's tearsheet: a side navigation switches the form shown. Controlled by `open`. */
export function EditTearsheet({
  open,
  onClose,
  onSubmit,
  title,
  description,
  label,
  variant = 'wide',
  headerActions,
  decorator,
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
  const [panelOpen, setPanelOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Focused once the form it belongs to is shown.
  const focusAfterSwitch = useRef<
    HTMLElement | (() => HTMLElement | null) | null
  >(null);
  // The `errorCount` of the last error the invalid-field effect dealt with.
  const handledError = useRef(0);
  const flow = useFlow<HTMLFormElement>({
    open,
    onClose,
    isDirty,
    confirmDiscard,
    closeWhilePending: true,
    launcherRef,
    messages: { error: text.error, errorText: text.errorText },
    initialFocus: (): HTMLElement | null | undefined =>
      flow.containerRef.current?.querySelector<HTMLElement>(
        firstVisibleControl
      ),
  });
  const small = useSmallScreen() || variant === 'narrow';

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

  // Set during render, so the first open commit already shows the right
  // form for the initial and error focus: each open starts on the first
  // form, and a new error shows the first form marked invalid.
  const [seen, setSeen] = useState({ open, error: flow.error });
  if (seen.open !== open || seen.error !== flow.error) {
    setSeen({ open, error: flow.error });
    if (open && !seen.open) {
      setCurrent(0);
      setPanelOpen(false);
    }
    const invalid = forms.findIndex((form) => form.invalid);
    if (flow.error !== null && seen.error === null && invalid >= 0)
      setCurrent(invalid);
  }
  const active = Math.max(0, Math.min(current, forms.length - 1));

  // An error field the consumer marked only in a hidden form: useFlow could
  // not focus it, so show its form and focus it there. A field in the shown
  // form wins. Runs after every render until the error is dealt with: the
  // consumer may mark the field a render or more after the error.
  useEffect(() => {
    const container = flow.containerRef.current;
    if (
      flow.error === null ||
      flow.errorCount === handledError.current ||
      !container
    )
      return;
    if (container.querySelector(`${visibleForm} [aria-invalid="true"]`)) {
      handledError.current = flow.errorCount;
      return;
    }
    const field = container.querySelector<HTMLElement>('[aria-invalid="true"]');
    const section = field?.closest(`.${ibm}__form`);
    const index = forms.findIndex((form) => form.id === section?.id);
    if (!field || index < 0) return;
    handledError.current = flow.errorCount;
    focusAfterSwitch.current = field;
    setCurrent(index);
  });

  useEffect(() => {
    const target = focusAfterSwitch.current;
    focusAfterSwitch.current = null;
    (typeof target === 'function' ? target() : target)?.focus();
  }, [active]);

  const select = (index: number, focusHeading = false) => {
    const form = forms[index];
    if (!form) return;
    // The user's choice wins over a field marked after the error.
    handledError.current = flow.errorCount;
    if (focusHeading && index !== active)
      focusAfterSwitch.current = () =>
        document.getElementById(`${form.id}-title`);
    setCurrent(index);
    setPanelOpen(false);
    onFormChange?.(index);
    // The effect on `active` does not run when the form is already shown.
    if (focusHeading && index === active)
      document.getElementById(`${form.id}-title`)?.focus();
  };

  // Save stays enabled with invalid forms; it shows and focuses the first one instead.
  const submit = async () => {
    const invalid = forms.findIndex((form) => form.invalid);
    if (invalid >= 0) select(invalid, true);
    else if (await flow.run(onSubmit)) flow.close();
  };

  const actions = [
    {
      kind: 'ghost' as const,
      label: text.cancel,
      onClick: flow.requestClose,
    },
    {
      kind: 'primary' as const,
      // Cast kept: ActionSet types `label` as a string but renders any node
      // as the button content. Its own `loading` flag adds an InlineLoading
      // with no text and an English icon name.
      label: (
        <FlowButtonLabel label={text.save} busy={flow.pending} />
      ) as unknown as string,
      disabled: submitDisabled || flow.pending,
      onClick: () => void submit(),
    },
  ];

  return (
    <>
      <Tearsheet
        {...rest}
        open={open}
        variant={variant}
        {...(decorator ? { decorator } : {})}
        // false: ComposedModal would otherwise close itself, while the
        // flow may keep it open (dirty, submitting).
        onClose={() => {
          flow.requestClose();
          return false;
        }}
        // Escape in the small-screen nav panel closes only that panel: IBM's
        // panel closes on a window listener, and the default action would
        // also cancel the tearsheet's native dialog.
        onKeyDownCapture={(event: KeyboardEvent<HTMLDivElement>) => {
          rest.onKeyDownCapture?.(event);
          if (event.key === 'Escape' && panelOpen) event.preventDefault();
        }}
        preventCloseOnClickOutside
        influencerWidth={influencerWidths[influencerWidth]}
        className={[ibm, 'afframe-edit-tearsheet', className]
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
            {...(headerActions ? { headerActions } : {})}
          />
        </Tearsheet.Header>
        <Tearsheet.Influencer
          isFlush
          influencerPanelAriaLabel={text.sectionsNavLabel}
          influencerPanelOpen={panelOpen}
          onInfluencerPanelClose={() => setPanelOpen(false)}
          influencerPanelTriggerRef={triggerRef as RefObject<HTMLElement>}>
          <SideNav
            aria-label={text.sectionsNavLabel}
            className="afframe-edit-tearsheet-nav"
            expanded
            isFixedNav={false}>
            <SideNavItems>
              {forms.map((form, index) => (
                <SideNavMenuItem
                  key={form.id}
                  // A link to the form, so the item is reachable by Tab;
                  // IBM's has no href.
                  href={`#${form.id}`}
                  isActive={index === active}
                  aria-current={index === active ? 'true' : undefined}
                  onClick={(event: MouseEvent) => {
                    // A new tab or window gets the link as is.
                    if (
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    select(index);
                  }}>
                  <span className="afframe-edit-tearsheet-nav-text">
                    {form.title}
                    {form.invalid && (
                      <WarningFilled
                        role="img"
                        aria-hidden={false}
                        aria-label={text.sectionInvalid(form.title)}
                        className="afframe-edit-tearsheet-nav-invalid"
                      />
                    )}
                  </span>
                </SideNavMenuItem>
              ))}
            </SideNavItems>
          </SideNav>
        </Tearsheet.Influencer>
        <Tearsheet.Body>
          <Tearsheet.MainContent isFlush>
            <FlowForm
              flow={flow}
              onSubmit={() => void submit()}
              submitDisabled={submitDisabled}
              aria-label={title}
              className={`${ibm}__content`}>
              {small && (
                // As IBM's story: a ghost icon button with 8px under it.
                <div className="afframe-edit-tearsheet-sections-trigger-wrapper">
                  <Button
                    ref={triggerRef}
                    kind="ghost"
                    size="md"
                    hasIconOnly
                    iconDescription={text.openSections}
                    renderIcon={RightPanelClose}
                    aria-expanded={panelOpen}
                    className="afframe-edit-tearsheet-sections-trigger"
                    onClick={() => setPanelOpen(true)}
                  />
                </div>
              )}
              <FormContext.Provider
                value={{
                  activeId: forms[active]?.id,
                  narrow: variant === 'narrow',
                }}>
                {formElements}
              </FormContext.Provider>
              {flow.error !== null && (
                // The fields' column, so the alert lines up with them.
                <Grid>
                  <Column sm={4} md={8} lg={variant === 'narrow' ? 16 : 8}>
                    <FlowError
                      error={flow.error}
                      iconDescription={text.errorIconDescription}
                    />
                  </Column>
                </Grid>
              )}
            </FlowForm>
            {/* Outside the form: its aria-busy may hold back announcements. */}
            <FlowStatus message={flow.pending ? text.pending : ''} />
          </Tearsheet.MainContent>
        </Tearsheet.Body>
        <Tearsheet.Footer actions={actions} buttonSize={small ? 'xl' : '2xl'} />
      </Tearsheet>
      <DiscardDialog flow={flow} messages={text} />
    </>
  );
}
