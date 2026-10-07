'use client';
// @carbon-labs/react-whats-new exports; see the Labs note in src/index.ts.
import {
  Bubble as BubbleValue,
  BubbleHeader as BubbleHeaderValue,
  Toc as TocValue,
  TocItem as TocItemValue,
  TocList as TocListValue,
  TocSection as TocSectionValue,
  TocSections as TocSectionsValue,
  ViewStack as ViewStackValue,
  View as ViewValue,
} from '@carbon-labs/react-whats-new';
import type { Bubble as BubbleType } from '@carbon-labs/react-whats-new/es/components/Bubble/Bubble.js';
import type { BubbleHeader as BubbleHeaderType } from '@carbon-labs/react-whats-new/es/components/Bubble/BubbleHeader.js';
import type { Toc as TocType } from '@carbon-labs/react-whats-new/es/components/Toc/Toc.js';
import type { TocItem as TocItemType } from '@carbon-labs/react-whats-new/es/components/Toc/TocItem.js';
import type { TocList as TocListType } from '@carbon-labs/react-whats-new/es/components/Toc/TocList.js';
import type { TocSection as TocSectionType } from '@carbon-labs/react-whats-new/es/components/Toc/TocSection.js';
import type { TocSections as TocSectionsType } from '@carbon-labs/react-whats-new/es/components/Toc/TocSections.js';
import type { ViewStack as ViewStackType } from '@carbon-labs/react-whats-new/es/components/ViewStack/ViewStack.js';
import type { View as ViewType } from '@carbon-labs/react-whats-new/es/components/ViewStack/View.js';

// What's New maps its es/ folder with a trailing-slash export, which Node no
// longer resolves, so only the types come from the deep paths.
export const Bubble: typeof BubbleType = BubbleValue;
export const BubbleHeader: typeof BubbleHeaderType = BubbleHeaderValue;
export const Toc: typeof TocType = TocValue;
export const TocItem: typeof TocItemType = TocItemValue;
export const TocList: typeof TocListType = TocListValue;
export const TocSection: typeof TocSectionType = TocSectionValue;
export const TocSections: typeof TocSectionsType = TocSectionsValue;
export const ViewStack: typeof ViewStackType = ViewStackValue;
export const View: typeof ViewType = ViewValue;
