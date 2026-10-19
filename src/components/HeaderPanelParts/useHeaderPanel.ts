'use client';
// Open state and focus handling shared by the two Afframe header actions
// (HelpMenu, EnvironmentSwitcher). Carbon's HeaderPanel focus listeners are
// turned off (`addFocusListeners={false}`): in controlled mode they close
// twice, reopen on a click on the action, and never return focus.
import { HeaderGlobalAction } from '@carbon/react';
import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  ComponentType,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  Ref,
} from 'react';
import { useMergedRefs } from '../FlowParts/refs.js';

/** Open state of a header action in `'panel'` mode. */
export interface HeaderPanelOpenProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Called with the new state on every open and close. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Props shared by the header actions that open a panel. `presentation`
 * `'panel'` (default) renders the action and its HeaderPanel; `'content'`
 * renders only the panel body, for a container that owns open state, outside
 * press, Escape and focus return (a Labs HeaderPopoverContent), so the open
 * state props and `renderAction` are type errors there.
 */
export type HeaderPanelActionProps =
  | (HeaderPanelOpenProps & {
      presentation?: 'panel';
      /**
       * A trigger to use instead of the default HeaderGlobalAction (for
       * example a ghost Button with visible text). It receives `ref`,
       * `onClick`, `aria-expanded` and `aria-controls`, and must name itself.
       */
      renderAction?: ReactElement;
    })
  | {
      presentation: 'content';
      open?: never;
      defaultOpen?: never;
      onOpenChange?: never;
      renderAction?: never;
    };

/**
 * Attributes the panel root sets itself: `id` names it for `aria-controls`,
 * and the open state handlers and `inert` drive it.
 */
export type HeaderPanelRootAttribute =
  'id' | 'inert' | 'onKeyDown' | 'onBlur' | 'children';

// HeaderGlobalAction and HeaderPanel pass other props on at runtime; their
// types do not list them.
export const HeaderAction = HeaderGlobalAction as ComponentType<
  ComponentProps<typeof HeaderGlobalAction> &
    ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> }
>;

// `| undefined`: the components destructure these props before passing them.
interface Options {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** The consumer's ref to the panel root. */
  ref?: Ref<HTMLDivElement> | undefined;
  /** Element to focus when the panel opens. */
  initialFocus: (panel: HTMLElement) => HTMLElement | null | undefined;
}

export function useHeaderPanel({
  open,
  defaultOpen = false,
  onOpenChange,
  ref,
  initialFocus,
}: Options) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = open !== undefined;
  const isOpen = open ?? innerOpen;
  const panelId = useId();
  const actionRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Latest rendered state, plus a request not yet rendered: handlers that run
  // twice before a re-render (a fast double click) see the first request.
  const openRef = useRef(isOpen);
  const pendingRef = useRef<boolean | null>(null);
  useLayoutEffect(() => {
    openRef.current = isOpen;
    pendingRef.current = null;
  });
  const requested = () => pendingRef.current ?? openRef.current;

  const setOpen = useCallback(
    (next: boolean) => {
      if ((pendingRef.current ?? openRef.current) === next) return;
      pendingRef.current = next;
      // Controlled: the parent decides through `open`; no inner state.
      if (!controlled) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange]
  );

  /** Closes; `returnFocus` moves focus back to the action. */
  const close = useCallback(
    (returnFocus: boolean) => {
      setOpen(false);
      if (returnFocus) actionRef.current?.focus();
    },
    [setOpen]
  );

  // Move focus in on open (not on first render, so a page load keeps focus).
  const wasOpen = useRef(isOpen);
  const initialFocusRef = useRef(initialFocus);
  useLayoutEffect(() => {
    initialFocusRef.current = initialFocus;
  });
  useEffect(() => {
    if (isOpen && !wasOpen.current && panelRef.current) {
      initialFocusRef.current(panelRef.current)?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  // A press outside the panel and the action closes; focus goes where the
  // user pressed.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !actionRef.current?.contains(target)
      ) {
        close(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, close]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && requested()) {
      event.stopPropagation();
      close(true);
    }
  };

  // Focus moving from the panel or the action to another element outside
  // both closes the panel. A null target (a press on empty panel space, a
  // window switch) does not.
  const onBlur = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (
      next &&
      requested() &&
      !panelRef.current?.contains(next) &&
      !actionRef.current?.contains(next)
    ) {
      close(false);
    }
  };

  const mergedPanelRef = useMergedRefs(panelRef, ref);
  const panelProps = {
    id: panelId,
    ref: mergedPanelRef,
    inert: !isOpen,
    onKeyDown,
    onBlur,
  };

  const actionProps = {
    ref: actionRef,
    'aria-expanded': isOpen,
    'aria-controls': panelId,
    onKeyDown,
    onBlur,
    onClick: () => setOpen(!requested()),
  };

  return { isOpen, close, panelProps, actionProps };
}

/**
 * The `renderAction` element with the trigger props. Its own ref receives the
 * node too, and its own onClick, onKeyDown and onBlur run first.
 */
export function cloneAction(
  element: ReactElement,
  props: ReturnType<typeof useHeaderPanel>['actionProps']
) {
  const own = element.props as {
    ref?: Ref<HTMLButtonElement>;
    onClick?: (event: MouseEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onBlur?: (event: FocusEvent) => void;
  };
  return cloneElement(element, {
    ...props,
    ref: (node: HTMLButtonElement | null) => {
      props.ref.current = node;
      if (typeof own.ref === 'function') own.ref(node);
      else if (own.ref) own.ref.current = node;
    },
    onClick: (event: MouseEvent) => {
      own.onClick?.(event);
      props.onClick();
    },
    onKeyDown: (event: KeyboardEvent) => {
      own.onKeyDown?.(event);
      props.onKeyDown(event);
    },
    onBlur: (event: FocusEvent) => {
      own.onBlur?.(event);
      props.onBlur(event);
    },
  } as object);
}
