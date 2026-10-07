/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, classnames inlined. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import {
  FileUploaderDropContainer,
  FileUploaderItem,
  FormItem,
} from '../../../index.js';

const prefix = 'cds';

type DropContainerProps = ComponentProps<typeof FileUploaderDropContainer>;

export type ExampleDropContainerAppProps = DropContainerProps & {
  size?: ComponentProps<typeof FileUploaderItem>['size'];
};

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
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const uploaderButton = useRef<HTMLButtonElement>(null);
  const uniqueId = useId();
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

  const uploadFile = async (fileToUpload: UploadedFile) => {
    // file size validation
    if (fileToUpload.filesize > 512000) {
      const updatedFile: UploadedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'File size exceeds limit',
        errorBody: '1 MB max file size. Select a new file and try again.',
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
      return;
    }

    // file type validation
    if (fileToUpload.invalidFileType) {
      const updatedFile: UploadedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
        invalid: true,
        errorSubject: 'Invalid file type',
        errorBody: `"${fileToUpload.name}" does not have a valid file type.`,
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
      return;
    }

    // simulate network request time
    const rand = Math.random() * 1000;
    setTimeout(() => {
      const updatedFile: UploadedFile = {
        ...fileToUpload,
        status: 'complete',
        iconDescription: 'Upload complete',
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
    }, rand);

    // show x icon after 1 second
    setTimeout(() => {
      const updatedFile: UploadedFile = {
        ...fileToUpload,
        status: 'edit',
        iconDescription: 'Delete file',
      };
      setFiles((files) =>
        files.map((file) =>
          file.uuid === fileToUpload.uuid ? updatedFile : file
        )
      );
    }, rand + 1000);
  };

  const onAddFiles = useCallback<NonNullable<DropContainerProps['onAddFiles']>>(
    (evt, { addedFiles }) => {
      evt.stopPropagation();
      props.onAddFiles?.(evt, { addedFiles });
      const newFiles = addedFiles.map((file): UploadedFile => ({
        uuid: uniqueId + file.name + file.size,
        name: file.name,
        filesize: file.size,
        status: 'uploading',
        iconDescription: 'Uploading',
        invalidFileType: file.invalidFileType,
      }));
      if (props.multiple) {
        setFiles([...files, ...newFiles]);
        newFiles.forEach(uploadFile);
      } else if (newFiles[0]) {
        setFiles([newFiles[0]]);
        uploadFile(newFiles[0]);
      }
    },
    [files, props.multiple, props.onAddFiles]
  );

  const handleFileUploaderItemClick = useCallback(
    (_: unknown, { uuid: clickedUuid }: { uuid: string }) => {
      uploaderButton.current?.focus();
      return setFiles(files.filter(({ uuid }) => clickedUuid !== uuid));
    },
    [files]
  );

  const labelClasses = props.disabled
    ? `${prefix}--file--label ${prefix}--file--label--disabled`
    : `${prefix}--file--label`;

  const helperTextClasses = props.disabled
    ? `${prefix}--label-description ${prefix}--label-description--disabled`
    : `${prefix}--label-description`;

  return (
    <FormItem>
      <p className={labelClasses}>Upload files</p>
      <p className={helperTextClasses}>
        Max file size is 1 MB. Supported file types are .jpg and .png.
      </p>
      <FileUploaderDropContainer
        {...props}
        onAddFiles={onAddFiles}
        innerRef={uploaderButton}
      />
      <div
        className={`${prefix}--file-container ${prefix}--file-container--drop`}>
        {files.map(
          ({
            uuid,
            name,
            filesize,
            status,
            iconDescription,
            invalid,
            ...rest
          }) => (
            <FileUploaderItem
              key={uuid}
              // Typed with a cast: upstream passes possibly undefined values and
              // the non-prop filesize through as is.
              {...({
                disabled: props.disabled, // or add per file disabled state as needed in files array
                uuid,
                name,
                filesize,
                size: props.size,
                status,
                iconDescription,
                invalid,
                onDelete: handleFileUploaderItemClick,
                ...rest,
              } as ComponentProps<typeof FileUploaderItem>)}
            />
          )
        )}
      </div>
    </FormItem>
  );
};

export default ExampleDropContainerApp;
