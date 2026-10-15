/**
 * Copyright IBM Corp. 2025, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: copied from IBM Products' makeDraggable stories, TypeScript, makeDraggable, components and icons from @afframe/ui, carbon tag, prefix as a literal, story names unified (the popover first, as Default), the icon-only drag and close buttons named with aria-label, scss styles replaced by make-draggable-story.css, the click log dropped. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Button, Popover, PopoverContent, makeDraggable } from '../../index.js';
import { Close, Draggable } from '../../icons.js';
import mdx from './makeDraggable.mdx';
import './make-draggable-story.css';

export default {
  title: 'Utilities/makeDraggable',
  tags: ['carbon'],
  parameters: {
    layout: 'padded',
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

const DraggableDiv = () => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (dialogElement && headerRef.current && dragRef.current) {
      const draggable = makeDraggable({
        el: dialogElement,
        dragHandle: headerRef.current,
        focusableDragHandle: dragRef.current,
      });

      const onDragStart = () => {
        dialogElement.classList.add('is-dragging');
        dialogElement.setAttribute(
          'aria-label',
          'Picked up the draggable Dialog'
        );
      };

      const onDragEnd = () => {
        dialogElement.classList.remove('is-dragging');
        dialogElement.setAttribute(
          'aria-label',
          'draggable Dialog was dropped'
        );
      };

      dialogElement.addEventListener('dragstart', onDragStart);
      dialogElement.addEventListener('dragend', onDragEnd);

      return () => {
        dialogElement.removeEventListener('dragstart', onDragStart);
        dialogElement.removeEventListener('dragend', onDragEnd);
        draggable.cleanup();
      };
    }
  }, []);

  return (
    <div className="mt-10 flex justify-center">
      <div ref={dialogRef} className="draggable__div">
        <div ref={headerRef} className="draggable__div-header">
          <header className="div-header">
            <Button
              kind="ghost"
              ref={dragRef}
              className="drag-icon-div"
              aria-label="Drag"
              aria-describedby="drag-instructions-div">
              <Draggable />
            </Button>
            <span id="drag-instructions-div" className="sr-only">
              To pick up the draggable item, press Enter. While dragging, use
              the arrow keys to move the item. Press Enter again to leave the
              item in its new position.
            </span>
          </header>
        </div>
        <div className="draggable__div-body">
          <p>This server has 150 GB of block storage remaining.</p>
        </div>
      </div>
    </div>
  );
};

const DraggablePopoverTemplate = () => {
  const [isOpen, setIsOpen] = useState(true);
  const dialogRef = useRef<HTMLSpanElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);

  // fallow-ignore-next-line complexity -- IBM's story effect, copied as shipped
  useEffect(() => {
    if (isOpen && dialogRef.current && headerRef.current && dragRef.current) {
      const dragContainer = dialogRef.current.querySelector('.cds--popover');
      const dragStyleContainer = dialogRef.current.querySelector(
        '.cds--popover-content'
      );
      if (dragContainer instanceof HTMLElement) {
        dragContainer.style.transform = 'none';
        dragContainer.style.left = '0px';
        dragContainer.style.top = '0px';
        const draggable = makeDraggable({
          el: dragContainer,
          dragHandle: headerRef.current,
          focusableDragHandle: dragRef.current,
        });

        const onDragStart = () => {
          if (dragStyleContainer) {
            dragStyleContainer.classList.add('is-dragging');
            dragStyleContainer.setAttribute(
              'aria-label',
              'Picked up the draggable popover'
            );
          }
        };

        const onDragEnd = () => {
          if (dragStyleContainer) {
            dragStyleContainer.classList.remove('is-dragging');
            dragStyleContainer.setAttribute(
              'aria-label',
              'draggable popover was dropped'
            );
          }
        };

        dragContainer.addEventListener('dragstart', onDragStart);
        dragContainer.addEventListener('dragend', onDragEnd);

        return () => {
          dragContainer.removeEventListener('dragstart', onDragStart);
          dragContainer.removeEventListener('dragend', onDragEnd);
          draggable.cleanup();
        };
      }
    }
  }, [isOpen]);
  return (
    <div className="mt-10 flex justify-center">
      <Popover open={isOpen} caret={false} ref={dialogRef} className="popover">
        <Button
          aria-expanded={isOpen}
          onClick={() => {
            setIsOpen(!isOpen);
          }}>
          Toggle
        </Button>

        <PopoverContent className="popover-content">
          <header ref={headerRef} className="popover-header popover-title">
            <Button
              kind="ghost"
              ref={dragRef}
              className="drag-icon"
              aria-label="Drag"
              aria-describedby="drag-instructions">
              <Draggable />
            </Button>
            <span id="drag-instructions" className="sr-only">
              To pick up the draggable item, press Enter. While dragging, use
              the arrow keys to move the item. Press Enter again to leave the
              item in its new position.
            </span>
            <Button
              kind="ghost"
              onClick={() => setIsOpen(false)}
              className="close-icon"
              aria-label="Close">
              <Close />
            </Button>
          </header>
          <p className="heading"> Available storage</p>
          <p className="popover-details">
            This server has 150 GB of block storage remaining.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const Default: StoryFn = DraggablePopoverTemplate.bind({});

export const CustomElement: StoryFn = DraggableDiv.bind({});
