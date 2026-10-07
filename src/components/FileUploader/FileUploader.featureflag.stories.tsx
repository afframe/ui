/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, FileUploader from @afframe/ui, WithFeatureFlags decorator removed (AfframeProvider turns the flag on), commented-out upstream line removed, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useRef } from 'react';
import type { ComponentProps, ComponentType, Ref, SyntheticEvent } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { FileUploader } from '../../index.js';

type FileUploaderArgs = ComponentProps<typeof FileUploader>;

type FileItem = NonNullable<
  Parameters<NonNullable<FileUploaderArgs['onDelete']>>[1]
>['deletedFile'];

// Carbon's FileUploaderHandle (not exported) with the methods the
// enhanced-file-uploader flag adds.
interface FileUploaderHandle {
  clearFiles: () => void;
  getCurrentFiles: () => FileItem[];
  setCurrentFiles: (files: FileItem[]) => void;
}

// FileUploader forwards a ref to its handle; its type does not declare it.
const FileUploaderWithRef = FileUploader as ComponentType<
  FileUploaderArgs & { ref?: Ref<FileUploaderHandle> }
>;

type FlagStoryArgs = Partial<Omit<FileUploaderArgs, 'disabled'>> & {
  disabled: boolean;
};

const defaultArgs = {
  accept: ['.jpg', '.png'],
  buttonKind: 'primary',
  buttonLabel: 'Add file(s)',
  disabled: false,
  filenameStatus: 'edit',
  iconDescription: 'Remove uploaded file',
  labelDescription:
    'Open browser console to see detailed callback data when adding/removing files',
  labelTitle: 'Enhanced FileUploader Demo',
  maxFileSize: 1024 * 1024,
  multiple: true,
  name: '',
  size: 'md',
} satisfies FileUploaderArgs;

const argTypes = {
  accept: { control: 'object' },
  buttonKind: {
    control: 'select',
    options: [
      'primary',
      'secondary',
      'danger',
      'ghost',
      'danger--primary',
      'tertiary',
    ],
  },
  buttonLabel: { control: 'text' },
  disabled: { control: 'boolean' },
  filenameStatus: {
    control: 'select',
    options: ['edit', 'complete', 'uploading'],
  },
  iconDescription: { control: 'text' },
  labelDescription: { control: 'text' },
  labelTitle: { control: 'text' },
  maxFileSize: { control: { type: 'number', min: 0, step: 1 } },
  multiple: { control: 'boolean' },
  name: { control: 'text' },
  onAddFiles: { action: 'onAddFiles' },
  onChange: { action: 'onChange' },
  onClick: { action: 'onClick' },
  onDelete: { action: 'onDelete' },
  size: { control: 'select', options: ['sm', 'md', 'lg'] },
} satisfies ArgTypes<FileUploaderArgs>;

export default {
  title: 'Components/FileUploader/Feature Flag',
  component: FileUploader,
  tags: ['carbon', '!autodocs'],
} satisfies Meta<typeof FileUploader>;

const DEBUG_ENABLED = true;

// Data the enhanced uploader adds to event.target.
interface LoggedFile {
  name?: string;
  uuid?: string;
}

interface EnhancedTarget {
  action?: string;
  addedFiles?: LoggedFile[];
  deletedFile?: LoggedFile;
  clearedFiles?: LoggedFile[];
  currentFiles?: LoggedFile[];
  remainingFiles?: LoggedFile[];
}

const debugLog = (...args: unknown[]) => {
  if (DEBUG_ENABLED) {
    console.log(...args);
  }
};

const mapFileList = (files: LoggedFile[] | undefined) =>
  files?.map((f) => ({ name: f.name, uuid: f.uuid })) || [];

const logFileList = (
  label: string,
  files: LoggedFile[] | LoggedFile | undefined
) => {
  if (Array.isArray(files)) {
    debugLog(label, mapFileList(files));
  } else if (files) {
    debugLog(label, { name: files.name, uuid: files.uuid });
  }
};

const logEventData = (event: SyntheticEvent) => {
  const target = event.target as EnhancedTarget;
  debugLog('  Action:', target.action);

  logFileList('  Added Files:', target.addedFiles);
  logFileList('  Deleted File:', target.deletedFile);
  logFileList('  Cleared Files:', target.clearedFiles);
  logFileList('  Current Files:', target.currentFiles);
};

const logDeleteData = (event: SyntheticEvent) => {
  const target = event.target as EnhancedTarget;
  debugLog('  Deleted File Object:', target.deletedFile);
  debugLog('  Deleted File Name:', target.deletedFile?.name);
  logFileList('  Remaining Files:', target.remainingFiles);
};

export const EnhancedCallbacks: StoryFn<FlagStoryArgs> = (args) => {
  const { onChange, onDelete, ...rest } = args;
  const handleChange: FileUploaderArgs['onChange'] = (event, data) => {
    logEventData(event);
    onChange?.(event, data);
  };

  const handleDelete: FileUploaderArgs['onDelete'] = (event, data) => {
    logDeleteData(event);
    onDelete?.(event, data);
  };

  return (
    <div>
      <FileUploader
        labelTitle="Enhanced FileUploader Demo"
        labelDescription="Open browser console to see detailed callback data when adding/removing files"
        buttonLabel="Add file(s)"
        buttonKind="primary"
        filenameStatus="edit"
        multiple={true}
        iconDescription="Remove uploaded file"
        {...rest}
        onChange={handleChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

EnhancedCallbacks.args = {
  ...defaultArgs,
};

EnhancedCallbacks.argTypes = { ...argTypes };

export const ControlledFileState: StoryFn<FlagStoryArgs> = (args) => {
  const { disabled, onChange, onDelete, ...rest } = args;
  const fileUploaderRef = useRef<FileUploaderHandle>(null);

  useEffect(() => {
    if (!fileUploaderRef.current) return;
    const currentFiles = fileUploaderRef.current.getCurrentFiles();
    if (!currentFiles?.length) return;

    const mutatedFiles = currentFiles.map((file) => ({
      ...file,
      disabled,
    }));

    fileUploaderRef.current.setCurrentFiles(mutatedFiles);
  }, [disabled]);

  const handleChange: FileUploaderArgs['onChange'] = (event, data) => {
    logEventData(event);
    onChange?.(event, data);
  };

  const handleDelete: FileUploaderArgs['onDelete'] = (event, data) => {
    logDeleteData(event);
    onDelete?.(event, data);
  };

  return (
    <div>
      <FileUploaderWithRef
        ref={fileUploaderRef}
        accept={['.jpg', '.png']}
        labelTitle="Enhanced FileUploader Demo"
        buttonLabel="Add file(s)"
        buttonKind="primary"
        filenameStatus="edit"
        multiple
        iconDescription="Remove uploaded file"
        {...rest}
        disabled={disabled}
        onChange={handleChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

ControlledFileState.args = {
  ...defaultArgs,
  labelDescription:
    'Add files, then toggle the disabled state and notice that the state is passed to the items.',
};

ControlledFileState.argTypes = { ...argTypes };
