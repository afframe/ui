'use client';
// Afframe APIKeyModal: names, generates and shows an API key once, or
// renames an existing key (Carbon "Generate an API key" pattern). Written for
// Afframe; IBM's deprecated APIKeyModal was a behaviour reference only.
import {
  Button,
  CopyButton,
  Modal,
  PasswordInput,
  TextInput,
} from '@carbon/react';
import { Download } from '@carbon/icons-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import {
  FlowDescription,
  FlowError,
  FlowStatus,
} from '../FlowParts/FlowParts.js';
import { defaultTaskModalMessages } from '../FlowParts/messages.js';
import type { FlowMessages } from '../FlowParts/messages.js';
import type { ModalRootAttribute } from '../FlowParts/refs.js';
import { useFlow } from '../FlowParts/useFlow.js';

export interface APIKeyModalMessages extends FlowMessages {
  nameLabel: string;
  nameHelper: string;
  generate: string;
  save: string;
  keyLabel: string;
  /** Accessible name of the key toggle while the key is hidden. */
  showKey: string;
  /** Accessible name of the key toggle while the key is shown. */
  hideKey: string;
  /** Accessible name of the copy button. */
  copy: string;
  /** Copy button feedback until the clipboard answers. */
  copying: string;
  /** Copy button feedback and the announcement after a copy. */
  copied: string;
  /** Announced when the clipboard refused the key. */
  copyFailed: string;
  /** Shown under the key. */
  storeWarning: string;
  download: string;
  previous: string;
  next: string;
  /** Primary button of the success view; closes the dialog. */
  done: string;
}

export const defaultAPIKeyModalMessages: APIKeyModalMessages = {
  ...defaultTaskModalMessages,
  nameLabel: 'Name',
  nameHelper: 'A name helps you tell your keys apart.',
  generate: 'Generate',
  save: 'Save',
  keyLabel: 'API key',
  showKey: 'Show key',
  hideKey: 'Hide key',
  copy: 'Copy key',
  copying: 'Copying',
  copied: 'Copied',
  copyFailed: 'The key could not be copied. Select it and copy it by hand.',
  storeWarning:
    'Store this key now in a safe place. It is not shown again after you close this dialog.',
  download: 'Download',
  previous: 'Previous',
  next: 'Next',
  done: 'Done',
};

export interface APIKeyModalStep {
  title: string;
  content: ReactNode;
  /** False disables Next. */
  valid?: boolean;
}

interface APIKeyModalOwnProps {
  open: boolean;
  onClose: () => void;
  /** Focus target on close; default the element focused before opening. */
  launcherRef?: RefObject<HTMLElement | null>;
  messages?: Partial<APIKeyModalMessages>;
  className?: string;
  /** Initial name. */
  apiKeyName?: string;
  /** Default true: Generate and Save stay disabled while the name is empty. */
  nameRequired?: boolean;
  /** Adds a Download button to the success view. */
  showDownload?: boolean;
  /** File name without extension; default `apikey`. */
  downloadFileName?: string;
  /** Default `txt` (the key only); `json` writes `{ name, apiKey }`. */
  downloadFileType?: 'txt' | 'json';
  /** Custom steps shown before the name step, with Previous and Next. */
  steps?: APIKeyModalStep[];
  /** Modal heading; pick one per `mode`. */
  title: string;
  /** Small text above the title. */
  label?: ReactNode;
  /** Text above the content. */
  description?: ReactNode;
}

/** The rest go to Carbon Modal's root `div`. */
interface APIKeyModalBaseProps
  extends
    APIKeyModalOwnProps,
    Omit<
      HTMLAttributes<HTMLDivElement>,
      | keyof APIKeyModalOwnProps
      | ModalRootAttribute
      | 'mode'
      | 'onGenerate'
      | 'onSave'
    > {
  /** Carbon Modal's root `div`; null while closed. */
  ref?: Ref<HTMLDivElement> | undefined;
  // Carbon types it without `undefined`.
  id?: string;
}

/** `mode` decides which callback is required. */
export type APIKeyModalProps = APIKeyModalBaseProps &
  (
    | {
        /** Default `generate`. */
        mode?: 'generate';
        /** Creates the key and resolves with it; an empty key is a failure. */
        onGenerate: (name: string) => Promise<string>;
        onSave?: never;
      }
    | {
        mode: 'edit';
        /** Saves the new name. */
        onSave: (name: string) => void | Promise<void>;
        onGenerate?: never;
      }
  );

function download(
  key: string,
  name: string,
  fileName: string,
  type: 'txt' | 'json',
  container: HTMLElement
) {
  const blob =
    type === 'json'
      ? new Blob([JSON.stringify({ name, apiKey: key }, null, 2)], {
          type: 'application/json',
        })
      : new Blob([key], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.${type}`;
  // Attached while clicked (some browsers ignore detached links), inside the
  // dialog because the page behind a modal dialog is inert.
  container.append(link);
  link.click();
  link.remove();
  // Revoked after the download had time to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// The success view: the key (read-only, hidden until toggled), the warning,
// Copy and the optional Download.
function KeyView({
  id,
  inputRef,
  text,
  feedback,
  onCopy,
  onDownload,
}: {
  id: string;
  inputRef: RefObject<HTMLInputElement | null>;
  text: APIKeyModalMessages;
  feedback: string;
  onCopy: () => void;
  onDownload?: () => void;
}) {
  return (
    <>
      <PasswordInput
        ref={inputRef}
        id={id}
        labelText={text.keyLabel}
        helperText={text.storeWarning}
        showPasswordLabel={text.showKey}
        hidePasswordLabel={text.hideKey}
        readOnly
        autoComplete="off"
      />
      <div className="afframe-api-key-modal-actions">
        <CopyButton
          iconDescription={text.copy}
          feedback={feedback}
          onClick={onCopy}
        />
        {onDownload && (
          <Button
            kind="tertiary"
            size="md"
            renderIcon={Download}
            onClick={onDownload}>
            {text.download}
          </Button>
        )}
      </div>
    </>
  );
}

export function APIKeyModal(props: APIKeyModalProps) {
  const {
    mode = 'generate',
    onGenerate,
    onSave,
    open,
    onClose,
    launcherRef,
    messages,
    className,
    apiKeyName = '',
    nameRequired = true,
    showDownload = false,
    downloadFileName = 'apikey',
    downloadFileType = 'txt',
    steps = [],
    title,
    label,
    description,
    ...rest
  } = props;
  const text = resolveMessages(defaultAPIKeyModalMessages, messages);
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(apiKeyName);
  // The key lives only here, only while the dialog is open.
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [openedFor, setOpenedFor] = useState(open);
  if (openedFor !== open) {
    setOpenedFor(open);
    setApiKey(null);
    setAnnouncement('');
    if (open) {
      setStep(0);
      setName(apiKeyName);
      setSucceeded(false);
    }
  }

  const nameStep = steps.length;
  const customStep = step < nameStep ? steps[step] : undefined;
  const { containerRef, ...dialog } = useFlow({
    open,
    onClose,
    launcherRef,
    messages: { error: text.error, errorText: text.errorText },
    initialFocus: (): HTMLElement | null =>
      nameStep === 0 ? nameRef.current : containerRef.current,
  });

  // Set the key through the DOM property only: a React `value` would also
  // write it into the input's value attribute.
  useEffect(() => {
    if (keyRef.current) keyRef.current.value = apiKey ?? '';
  }, [apiKey, succeeded]);

  // Move focus with the content: a new step, the name field, the key.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    if (succeeded) keyRef.current?.focus();
    else if (step === nameStep) nameRef.current?.focus();
    else containerRef.current?.focus();
  }, [step, succeeded, nameStep, containerRef]);

  const goTo = (next: number) => {
    moved.current = true;
    setStep(next);
  };

  const trimmed = name.trim();
  const nameMissing = nameRequired && trimmed === '';

  const generate = async () => {
    let key: string | undefined;
    const ok = await dialog.run(async () => {
      if (!onGenerate) return;
      const generated = await onGenerate(trimmed);
      // An empty key would show an empty success view: treat it as a failure.
      if (typeof generated !== 'string' || generated === '') {
        throw new Error('onGenerate resolved without a key');
      }
      key = generated;
    });
    if (ok && key !== undefined) {
      moved.current = true;
      setApiKey(key);
      setSucceeded(true);
    }
  };

  const save = async () => {
    if (!onSave) return;
    if (await dialog.run(() => onSave(trimmed))) dialog.close();
  };

  // The copy button shows its feedback on click, before the clipboard
  // answers: it says `copying` until the result, then the same text as the
  // live region.
  const [copyFeedback, setCopyFeedback] = useState(text.copied);
  const copy = async () => {
    if (apiKey === null) return;
    setCopyFeedback(text.copying);
    let result = text.copied;
    try {
      await navigator.clipboard.writeText(apiKey);
    } catch {
      result = text.copyFailed;
    }
    setCopyFeedback(result);
    setAnnouncement(result);
  };

  // One primary button per view: success, a custom step, or the name step.
  const primary = succeeded
    ? { text: text.done, disabled: false, action: onClose }
    : customStep
      ? {
          text: text.next,
          disabled: customStep.valid === false,
          action: () => goTo(step + 1),
        }
      : {
          text: mode === 'edit' ? text.save : text.generate,
          disabled: nameMissing,
          action: mode === 'edit' ? save : generate,
        };
  const hasPrevious = !succeeded && step > 0;

  return (
    <Modal
      {...rest}
      open={open}
      size="sm"
      preventCloseOnClickOutside
      className={['afframe-api-key-modal', className].filter(Boolean).join(' ')}
      modalHeading={title}
      {...(label ? { modalLabel: label } : {})}
      primaryButtonText={primary.text}
      primaryButtonDisabled={primary.disabled}
      {...(succeeded
        ? {}
        : { secondaryButtonText: hasPrevious ? text.previous : text.cancel })}
      {...(hasPrevious ? { onSecondarySubmit: () => goTo(step - 1) } : {})}
      closeButtonLabel={text.closeIconDescription}
      loadingStatus={dialog.pending ? 'active' : 'inactive'}
      loadingDescription={text.pending}
      loadingIconDescription={text.pending}
      onRequestClose={dialog.requestClose}
      onRequestSubmit={() => {
        if (!primary.disabled && !dialog.pending) void primary.action();
      }}>
      <div ref={containerRef} tabIndex={-1} className="afframe-modal-body">
        <FlowDescription description={description} />
        {succeeded ? (
          <KeyView
            id={`${id}-key`}
            inputRef={keyRef}
            text={text}
            feedback={copyFeedback}
            onCopy={() => void copy()}
            {...(showDownload
              ? {
                  onDownload: () =>
                    apiKey !== null &&
                    download(
                      apiKey,
                      trimmed,
                      downloadFileName,
                      downloadFileType,
                      containerRef.current ?? document.body
                    ),
                }
              : {})}
          />
        ) : customStep ? (
          <section aria-labelledby={`${id}-step`}>
            <h3 id={`${id}-step`} className="afframe-api-key-modal-step">
              {customStep.title}
            </h3>
            {customStep.content}
          </section>
        ) : (
          <TextInput
            ref={nameRef}
            id={`${id}-name`}
            labelText={text.nameLabel}
            helperText={text.nameHelper}
            value={name}
            autoComplete="off"
            // Not disabled while pending: Carbon's disabled helper text fails
            // the contrast check. The name is read when Generate is pressed.
            onChange={(event) => setName(event.target.value)}
          />
        )}
        <FlowStatus message={announcement} />
        <FlowError
          error={dialog.error}
          iconDescription={text.errorIconDescription}
        />
      </div>
    </Modal>
  );
}
