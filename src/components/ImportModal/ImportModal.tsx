'use client';
// Afframe ImportModal: picks files (or a URL) to import (Carbon "Import"
// and "Upload" patterns). Written for Afframe; IBM's deprecated ImportModal
// was a behaviour reference only.
import {
  Button,
  FileUploaderDropContainer,
  FileUploaderItem,
  Modal,
  TextInput,
  usePrefix,
} from '@carbon/react';
import { useId, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import { ModalError, ModalStatus } from '../ModalParts/ModalFeedback.js';
import { formatFileSize } from '../ModalParts/fileSize.js';
import { defaultModalPartsMessages } from '../ModalParts/messages.js';
import type { ModalPartsMessages } from '../ModalParts/messages.js';
import { useModalBase } from '../ModalParts/useModalBase.js';

export interface ImportModalMessages extends ModalPartsMessages {
  title: string;
  description: string;
  /** Label above the drop area. */
  dropLabel: string;
  /** Text of the drop area button. */
  browseLabel: string;
  /** Accepted types and size limit under the drop area; `limit` is formatted. */
  requirements: (accept: string[], limit: string | undefined) => string;
  urlLabel: string;
  urlPlaceholder: string;
  urlButton: string;
  /** Primary button. */
  import: string;
  /** Remove button of a listed file; Carbon appends " - <file name>". */
  removeFile: string;
  invalidType: (name: string, accept: string[]) => string;
  /** `limit` is the formatted maximum size. */
  tooLarge: (name: string, limit: string) => string;
  /** Alert when `onImport` or `onImportUrl` rejects. */
  importFailed: string;
  /** Announced when a valid file is added. */
  fileAdded: (name: string) => string;
  /** Shown and announced when files beyond the first are dropped without `multiple`. */
  extraFilesIgnored: (count: number) => string;
}

export const defaultImportModalMessages: ImportModalMessages = {
  ...defaultModalPartsMessages,
  title: 'Import',
  description: 'Add a file to import.',
  dropLabel: 'File',
  browseLabel: 'Drag and drop a file here or click to browse',
  requirements: (accept, limit) =>
    [
      accept.length > 0 ? `Accepted: ${accept.join(', ')}.` : '',
      limit === undefined ? '' : `Maximum size: ${limit}.`,
    ]
      .filter(Boolean)
      .join(' '),
  urlLabel: 'Or import from a URL',
  urlPlaceholder: 'https://example.com/file.csv',
  urlButton: 'Import from URL',
  import: 'Import',
  removeFile: 'Remove file',
  invalidType: (name, accept) =>
    `${name} is not an accepted file type. Use ${accept.join(', ')}.`,
  tooLarge: (name, limit) => `${name} is larger than ${limit}.`,
  importFailed: 'The import failed. Try again.',
  fileAdded: (name) => `${name} added.`,
  extraFilesIgnored: (count) =>
    `Only one file can be imported; ${count} other ${count === 1 ? 'file was' : 'files were'} ignored.`,
};

export interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  launcherRef?: RefObject<HTMLElement | null>;
  messages?: Partial<ImportModalMessages>;
  className?: string;
  /** Accepted extensions (`.csv`) or MIME types (`text/csv`, `image/*`). Empty: any file. */
  accept?: string[];
  /** Largest accepted file, in bytes. */
  maxFileSize?: number;
  multiple?: boolean;
  /** Called with the valid files; a rejected promise keeps the dialog open. */
  onImport: (files: File[]) => void | Promise<void>;
  /** When set, a URL field and button are shown. */
  onImportUrl?: (url: string) => void | Promise<void>;
  /** Heading; default `messages.title`. */
  title?: string;
  /** Text under the heading; default `messages.description`. */
  description?: string;
  /** Locale of the file sizes; default the package locale (cs-CZ). */
  locale?: string;
}

interface Item {
  id: string;
  file: File;
  error?: string;
}

// MIME types for a file the browser gave no type (`file.type === ''`), so
// MIME rules still apply to it. Common types only.
const typesByExtension: Record<string, string> = {
  csv: 'text/csv',
  txt: 'text/plain',
  json: 'application/json',
  xml: 'application/xml',
  pdf: 'application/pdf',
  zip: 'application/zip',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

function accepts(file: File, accept: string[]): boolean {
  if (accept.length === 0) return true;
  const name = file.name.toLowerCase();
  const type =
    file.type.toLowerCase() ||
    (typesByExtension[name.split('.').pop() ?? ''] ?? '');
  return accept.some((rule) => {
    const value = rule.toLowerCase();
    if (value.startsWith('.')) return name.endsWith(value);
    if (value.endsWith('/*')) return type.startsWith(value.slice(0, -1));
    return type === value;
  });
}

export function ImportModal({
  open,
  onClose,
  launcherRef,
  messages,
  className,
  accept = [],
  maxFileSize,
  multiple = false,
  onImport,
  onImportUrl,
  title,
  description,
  locale,
}: ImportModalProps) {
  const text = resolveMessages(defaultImportModalMessages, messages);
  const prefix = usePrefix();
  const baseId = useId();
  const nextId = useRef(0);
  const dropRef = useRef<HTMLButtonElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [url, setUrl] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [ignoredNote, setIgnoredNote] = useState('');
  // Carbon passes only the first dropped file without `multiple`; count the
  // drop first so the user can be told about the rest.
  const droppedCount = useRef(0);
  const [openedFor, setOpenedFor] = useState(open);
  if (openedFor !== open) {
    setOpenedFor(open);
    if (open) {
      setItems([]);
      setUrl('');
      setAnnouncement('');
      setIgnoredNote('');
    }
  }

  const dialog = useModalBase({
    open,
    onClose,
    launcherRef,
    initialFocus: () => dropRef.current,
  });

  const limit =
    maxFileSize === undefined ? undefined : formatFileSize(maxFileSize, locale);
  const requirements = text.requirements(accept, limit);

  // The drop area and rows stay enabled while an import runs (Carbon's
  // disabled styles fail the contrast check); changes wait instead.
  const addFiles = (files: File[]) => {
    if (dialog.pending) return;
    const added: Item[] = files.map((file) => {
      nextId.current += 1;
      const id = `${baseId}-file-${nextId.current}`;
      if (!accepts(file, accept)) {
        return { id, file, error: text.invalidType(file.name, accept) };
      }
      if (limit !== undefined && maxFileSize !== undefined) {
        if (file.size > maxFileSize) {
          return { id, file, error: text.tooLarge(file.name, limit) };
        }
      }
      return { id, file };
    });
    // A file with the same name replaces the listed one (one row per name).
    setItems((current) =>
      multiple
        ? [
            ...current.filter(
              (item) => !added.some((next) => next.file.name === item.file.name)
            ),
            ...added,
          ]
        : added.slice(0, 1)
    );
    dialog.clearFailure();
    // Errors are announced by the file row itself (Carbon renders them with
    // role="alert"); the polite region announces the files that were added.
    const ignored = multiple
      ? 0
      : Math.max(droppedCount.current, files.length) - 1;
    droppedCount.current = 0;
    const note = ignored > 0 ? text.extraFilesIgnored(ignored) : '';
    setIgnoredNote(note);
    setAnnouncement(
      [
        ...added
          .filter((item) => item.error === undefined)
          .map((item) => text.fileAdded(item.file.name)),
        note,
      ]
        .filter(Boolean)
        .join(' ')
    );
  };

  const removeItem = (id: string) => {
    if (dialog.pending) return;
    setItems((current) => current.filter((item) => item.id !== id));
    setAnnouncement('');
    setIgnoredNote('');
    dropRef.current?.focus();
  };

  const validFiles = items.filter((item) => item.error === undefined);
  const hasInvalid = validFiles.length !== items.length;
  const trimmedUrl = url.trim();
  const canImportFiles = validFiles.length > 0 && !hasInvalid;
  const canImportUrl = onImportUrl !== undefined && trimmedUrl !== '';

  const importUrl = async () => {
    if (dialog.pending || !canImportUrl) return;
    if (await dialog.run(() => onImportUrl?.(trimmedUrl))) onClose();
  };

  const importFiles = async () => {
    if (dialog.pending) return;
    if (canImportFiles) {
      if (await dialog.run(() => onImport(validFiles.map((item) => item.file))))
        onClose();
      return;
    }
    if (canImportUrl) await importUrl();
  };

  return (
    <Modal
      open={open}
      size="sm"
      preventCloseOnClickOutside
      className={['afframe-import-modal', className].filter(Boolean).join(' ')}
      modalHeading={title ?? text.title}
      primaryButtonText={text.import}
      secondaryButtonText={text.cancel}
      primaryButtonDisabled={!(canImportFiles || (!hasInvalid && canImportUrl))}
      closeButtonLabel={text.closeIconDescription}
      loadingStatus={dialog.pending ? 'active' : 'inactive'}
      loadingDescription={text.pending}
      loadingIconDescription={text.pending}
      launcherButtonRef={dialog.returnFocusRef}
      onRequestClose={dialog.requestClose}
      onRequestSubmit={() => void importFiles()}>
      <div ref={dialog.bodyRef} tabIndex={-1} className="afframe-modal-body">
        <p>{description ?? text.description}</p>
        <div
          className="afframe-import-modal-drop"
          onDropCapture={(event) => {
            droppedCount.current = event.dataTransfer.files.length;
          }}>
          <p className={`${prefix}--file--label`}>{text.dropLabel}</p>
          {requirements !== '' && (
            <p className={`${prefix}--label-description`}>{requirements}</p>
          )}
          <FileUploaderDropContainer
            innerRef={dropRef}
            labelText={text.browseLabel}
            multiple={multiple}
            onAddFiles={(_event, { addedFiles }) => addFiles(addedFiles)}
          />
          {ignoredNote !== '' && (
            <p className={`${prefix}--form__helper-text`}>{ignoredNote}</p>
          )}
          {items.length > 0 && (
            <ul className="afframe-import-modal-files">
              {items.map((item) => (
                <li key={item.id}>
                  <FileUploaderItem
                    uuid={item.id}
                    name={item.file.name}
                    status="edit"
                    size="md"
                    iconDescription={text.removeFile}
                    invalid={item.error !== undefined}
                    {...(item.error === undefined
                      ? {}
                      : { errorSubject: item.error })}
                    onDelete={() => removeItem(item.id)}
                  />
                  <p className="afframe-import-modal-size">
                    {formatFileSize(item.file.size, locale)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        {onImportUrl !== undefined && (
          <div className="afframe-import-modal-url">
            <TextInput
              id={`${baseId}-url`}
              type="url"
              labelText={text.urlLabel}
              placeholder={text.urlPlaceholder}
              value={url}
              autoComplete="off"
              disabled={dialog.pending}
              onChange={(event) => setUrl(event.target.value)}
            />
            <Button
              kind="tertiary"
              size="md"
              disabled={!canImportUrl || dialog.pending}
              onClick={() => void importUrl()}>
              {text.urlButton}
            </Button>
          </div>
        )}
        <ModalStatus message={announcement} />
        <ModalError
          show={dialog.failed}
          title={text.importFailed}
          iconDescription={text.errorIconDescription}
        />
      </div>
    </Modal>
  );
}
