/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, classnames inlined, file name in the invalid type message read from the uploaded file (upstream read it from the array). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useId, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import {
  FileUploaderDropContainer,
  FileUploaderItem,
  FormItem,
} from '../../../index.js';
import type { ExampleDropContainerAppProps } from './drop-container.js';

const prefix = 'cds';

type DropContainerProps = ComponentProps<typeof FileUploaderDropContainer>;

interface UploadedFile {
  uuid: string;
  name: string;
  filesize: number;
  status: 'uploading' | 'edit' | 'complete';
  iconDescription: string;
  invalidFileType?: boolean | undefined;
  invalid?: boolean;
  errorSubject?: string;
  errorBody?: string;
}

const ExampleDropContainerApp = (props: ExampleDropContainerAppProps) => {
  const [file, setFile] = useState<UploadedFile>();
  const uploaderButton = useRef<HTMLButtonElement>(null);
  const uniqueId = useId();
  const { disabled, size } = props;
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDragover = (e: DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragover', handleDragover);
    return () => {
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('dragover', handleDragover);
    };
  }, []);

  const uploadFile = async (fileToUpload: [UploadedFile]) => {
    // file size validation
    if (Array.isArray(fileToUpload) && fileToUpload[0].filesize > 512000) {
      const updatedFile: UploadedFile = {
        ...fileToUpload[0],
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'File size exceeds limit',
        errorBody: '1 MB max file size. Select a new file and try again.',
      };
      setFile(updatedFile);
      return;
    }

    // file type validation
    if (Array.isArray(fileToUpload) && fileToUpload[0].invalidFileType) {
      const updatedFile: UploadedFile = {
        ...fileToUpload[0],
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'Invalid file type',
        errorBody: `"${fileToUpload[0].name}" does not have a valid file type.`,
      };
      setFile(updatedFile);
      return;
    }

    // simulate network request time
    const rand = Math.random() * 1000;
    setTimeout(() => {
      const updatedFile: UploadedFile = {
        ...fileToUpload[0],
        status: 'complete',
        iconDescription: 'Upload complete',
      };
      setFile(updatedFile);
    }, rand);

    // show x icon after 1 second
    setTimeout(() => {
      const updatedFile: UploadedFile = {
        ...fileToUpload[0],
        status: 'edit',
        iconDescription: 'Delete file',
      };
      setFile(updatedFile);
    }, rand + 1000);
  };

  const onAddFilesButton: NonNullable<DropContainerProps['onAddFiles']> = (
    event,
    { addedFiles }
  ) => {
    props.onAddFiles?.(event, { addedFiles });
    // Upstream assumes at least one added file.
    const file = addedFiles as [(typeof addedFiles)[number]];

    const newFile: [UploadedFile] = [
      {
        uuid: uniqueId + file[0].name + file[0].size,
        name: file[0].name,
        filesize: file[0].size,
        status: 'uploading',
        iconDescription: 'Uploading',
        invalidFileType: file[0].invalidFileType,
      },
    ];

    setFile(newFile[0]);
    uploadFile([newFile[0]]);
  };

  const handleFileUploaderItemClick = () => {
    setFile(undefined);
  };

  const labelClasses = disabled
    ? `${prefix}--file--label ${prefix}--file--label--disabled`
    : `${prefix}--file--label`;

  const helperTextClasses = disabled
    ? `${prefix}--label-description ${prefix}--label-description--disabled`
    : `${prefix}--label-description`;

  return (
    <FormItem>
      <p className={labelClasses}>Upload files</p>
      <p className={helperTextClasses}>
        Max file size is 500kb. Supported file types are .jpg and .png.
      </p>
      {file === undefined && (
        <FileUploaderDropContainer
          {...props}
          onAddFiles={onAddFilesButton}
          innerRef={uploaderButton}
        />
      )}

      <div
        className={`${prefix}--file-container ${prefix}--file-container--drop`}>
        {file !== undefined && (
          <FileUploaderItem
            key={file.uuid}
            // Typed with a cast: upstream passes possibly undefined values, the
            // non-prop filesize and its drop container onAddFiles through as is.
            {...({
              disabled,
              uuid: file.uuid,
              name: file.name,
              filesize: file.filesize,
              errorSubject: 'File size exceeds limit',
              errorBody: '1 MB max file size. Select a new file and try again.',
              size,
              status: file.status,
              iconDescription: file.iconDescription,
              invalid: file.invalid,
              onDelete: handleFileUploaderItemClick,
              onAddFiles: onAddFilesButton,
            } as unknown as ComponentProps<typeof FileUploaderItem>)}
          />
        )}
      </div>
    </FormItem>
  );
};

export default ExampleDropContainerApp;
