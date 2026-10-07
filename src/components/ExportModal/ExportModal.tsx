'use client';
// Afframe ExportModal: names a file, picks its format and starts an export
// (Carbon "Export" pattern). Written for Afframe; IBM's deprecated
// ExportModal was a behaviour reference only.
import {
  Modal,
  PasswordInput,
  RadioButton,
  RadioButtonGroup,
  TextInput,
} from '@carbon/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import { ModalError, ModalStatus } from '../ModalParts/ModalFeedback.js';
import { defaultModalPartsMessages } from '../ModalParts/messages.js';
import type { ModalPartsMessages } from '../ModalParts/messages.js';
import { useModalBase } from '../ModalParts/useModalBase.js';

export interface ExportModalMessages extends ModalPartsMessages {
  title: string;
  filenameLabel: string;
  formatLegend: string;
  passwordLabel: string;
  /** Accessible name of the password toggle while the password is hidden. */
  showPassword: string;
  /** Accessible name of the password toggle while the password is shown. */
  hidePassword: string;
  /** Shown under a required password field left empty. */
  passwordRequired: string;
  /** Primary button. */
  export: string;
  /** Spinner text while `onExport` runs. */
  exporting: string;
  /** Announced when the export succeeded; `filename` includes the extension. */
  success: (filename: string) => string;
  /** Shown when the name is empty or has a character from \ / : * ? " < > | */
  invalidFilename: string;
}

export const defaultExportModalMessages: ExportModalMessages = {
  ...defaultModalPartsMessages,
  title: 'Export',
  filenameLabel: 'File name',
  formatLegend: 'Format',
  passwordLabel: 'Password',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  passwordRequired: 'Enter a password.',
  export: 'Export',
  exporting: 'Exporting',
  success: (filename) => `${filename} was exported.`,
  invalidFilename: 'Enter a name without these characters: \\ / : * ? " < > |',
};

export interface ExportFormat {
  /** For example `csv` or `.csv`. */
  extension: string;
  /** Radio label before the extension, for example `Spreadsheet`. */
  description?: string;
}

export interface ExportRequest {
  filename: string;
  extension: string;
  password?: string;
}

export interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  launcherRef?: RefObject<HTMLElement | null>;
  messages?: Partial<ExportModalMessages>;
  className?: string;
  /** Default file name, without the extension. */
  filename: string;
  /** Radio options; the first is selected. */
  formats: ExportFormat[];
  /** Runs the export; a rejected promise keeps the dialog open with an alert. */
  onExport: (request: ExportRequest) => void | Promise<void>;
  /** Default true; false shows the name read-only. */
  filenameEditable?: boolean;
  /** Shows a password field; `{ required: true }` makes it required. */
  password?: boolean | { required?: boolean };
  /** Extra name rules: return a message to reject the name. */
  validate?: (filename: string) => string | undefined;
  /** Default true: close after the success message has been announced. */
  closeOnSuccess?: boolean;
}

/** Time the success message stays before the dialog closes (Carbon's InlineLoading success delay). */
const closeDelay = 1500;

// eslint-disable-next-line no-control-regex
const forbidden = /[\\/:*?"<>|\u0000-\u001f]/;

const withDot = (extension: string) =>
  extension.startsWith('.') ? extension : `.${extension}`;

export function ExportModal({
  open,
  onClose,
  launcherRef,
  messages,
  className,
  filename: initialFilename,
  formats,
  onExport,
  filenameEditable = true,
  password,
  validate,
  closeOnSuccess = true,
}: ExportModalProps) {
  const text = resolveMessages(defaultExportModalMessages, messages);
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const firstFormat = formats[0]?.extension ?? '';
  const [filename, setFilename] = useState(initialFilename);
  const [chosen, setExtension] = useState(firstFormat);
  // New formats without the chosen one fall back to the first.
  const extension = formats.some((format) => format.extension === chosen)
    ? chosen
    : firstFormat;
  const [secret, setSecret] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [secretTouched, setSecretTouched] = useState(false);
  const [succeeded, setSucceeded] = useState('');
  const [openedFor, setOpenedFor] = useState(open);
  if (openedFor !== open) {
    setOpenedFor(open);
    if (open) {
      setFilename(initialFilename);
      setExtension(firstFormat);
      setSecret('');
      setNameTouched(false);
      setSecretTouched(false);
      setSucceeded('');
    }
  }

  const dialog = useModalBase({
    open,
    onClose,
    launcherRef,
    initialFocus: () => nameRef.current,
  });

  // onClose through a ref: a new function from a parent render must not
  // restart the timer. Closing first (open false) clears it.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open || !succeeded || !closeOnSuccess) return;
    const timer = setTimeout(() => onCloseRef.current(), closeDelay);
    return () => clearTimeout(timer);
  }, [open, succeeded, closeOnSuccess]);

  const trimmed = filename.trim();
  const nameError =
    trimmed === '' || forbidden.test(trimmed)
      ? text.invalidFilename
      : validate?.(trimmed);
  const passwordRequired =
    typeof password === 'object' && password.required === true;
  const secretMissing = passwordRequired && secret === '';
  const canExport =
    nameError === undefined && !secretMissing && !succeeded && extension !== '';

  const submit = async () => {
    if (!canExport || dialog.pending) return;
    const request: ExportRequest = {
      filename: trimmed,
      extension,
      ...(password && secret !== '' ? { password: secret } : {}),
    };
    if (await dialog.run(() => onExport(request))) {
      setSecret('');
      setSucceeded(text.success(`${trimmed}${withDot(extension)}`));
    }
  };

  return (
    <Modal
      open={open}
      size="sm"
      preventCloseOnClickOutside
      className={['afframe-export-modal', className].filter(Boolean).join(' ')}
      modalHeading={text.title}
      primaryButtonText={text.export}
      secondaryButtonText={text.cancel}
      primaryButtonDisabled={!canExport}
      closeButtonLabel={text.closeIconDescription}
      loadingStatus={dialog.pending ? 'active' : 'inactive'}
      loadingDescription={text.exporting}
      loadingIconDescription={text.exporting}
      launcherButtonRef={dialog.returnFocusRef}
      onRequestClose={dialog.requestClose}
      onRequestSubmit={() => void submit()}>
      <div ref={dialog.bodyRef} tabIndex={-1} className="afframe-modal-body">
        <TextInput
          ref={nameRef}
          id={`${id}-name`}
          labelText={text.filenameLabel}
          value={filename}
          readOnly={!filenameEditable}
          autoComplete="off"
          invalid={nameTouched && nameError !== undefined}
          invalidText={nameError}
          onChange={(event) => {
            setFilename(event.target.value);
            setNameTouched(true);
          }}
          onBlur={() => setNameTouched(true)}
        />
        <RadioButtonGroup
          name={`${id}-format`}
          legendText={text.formatLegend}
          orientation="vertical"
          valueSelected={extension}
          onChange={(value) => setExtension(String(value))}>
          {formats.map((format) => (
            <RadioButton
              key={format.extension}
              id={`${id}-format-${format.extension}`}
              value={format.extension}
              labelText={
                format.description === undefined
                  ? withDot(format.extension)
                  : `${format.description} (${withDot(format.extension)})`
              }
            />
          ))}
        </RadioButtonGroup>
        {password && (
          // Uncontrolled: React would mirror a controlled value into the
          // value attribute. The key remounts it (empty) on every open.
          <PasswordInput
            key={String(openedFor)}
            id={`${id}-password`}
            labelText={text.passwordLabel}
            showPasswordLabel={text.showPassword}
            hidePasswordLabel={text.hidePassword}
            autoComplete="new-password"
            invalid={secretTouched && secretMissing}
            invalidText={text.passwordRequired}
            onChange={(event) => setSecret(event.target.value)}
            onBlur={() => setSecretTouched(true)}
          />
        )}
        <ModalStatus message={succeeded} visible />
        <ModalError
          show={dialog.failed}
          title={text.genericError}
          iconDescription={text.errorIconDescription}
        />
      </div>
    </Modal>
  );
}
