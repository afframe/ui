'use client';
import { Component, lazy, Suspense } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { ElementError, ElementLoading } from './states.js';

/** An engine's module failed to load (not a render error). */
class EngineLoadError extends Error {
  constructor(cause: unknown) {
    super('The engine could not load', { cause });
  }
}

export interface LazyEngine<P extends object> {
  /** Renders the engine; suspends while its module loads. */
  Engine: ComponentType<P>;
  /** Drops a failed load, so the next mount imports again. */
  reset: () => void;
}

/**
 * An engine loaded on first render with import(). React.lazy keeps a
 * rejected import for good, so a failed load is cleared (`reset`) and the
 * next mount tries again, as AIChat's loader does.
 */
export function lazyEngine<P extends object>(
  load: () => Promise<ComponentType<P>>
): LazyEngine<P> {
  let pending: Promise<{ default: ComponentType<P> }> | undefined;
  const importOnce = () =>
    (pending ??= load().then(
      (component) => ({ default: component }),
      (error: unknown) => {
        pending = undefined;
        throw new EngineLoadError(error);
      }
    ));
  let Lazy = lazy(importOnce);
  function Engine(props: P) {
    return <Lazy {...props} />;
  }
  return {
    Engine,
    reset: () => {
      Lazy = lazy(importOnce);
    },
  };
}

interface BoundaryProps {
  loadErrorTitle: string;
  renderErrorTitle: string;
  onError: () => void;
  children: ReactNode;
}

type Failure = 'none' | 'load' | 'render';

// Catches a failed import and an engine that throws while drawing (such as
// ECharts on an option it cannot draw), so the rest of the chat renders.
class EngineBoundary extends Component<BoundaryProps, { failed: Failure }> {
  override state: { failed: Failure } = { failed: 'none' };

  static getDerivedStateFromError(error: unknown): { failed: Failure } {
    return { failed: error instanceof EngineLoadError ? 'load' : 'render' };
  }

  // Only a failed load resets the engine; a render error leaves the loaded
  // module to the other charts.
  override componentDidCatch(error: unknown) {
    if (error instanceof EngineLoadError) this.props.onError();
  }

  override render() {
    const { failed } = this.state;
    return failed === 'none' ? (
      this.props.children
    ) : (
      <ElementError
        title={
          failed === 'load'
            ? this.props.loadErrorTitle
            : this.props.renderErrorTitle
        }
      />
    );
  }
}

/** A skeleton while the engine loads, the error block if it fails to load or draw. */
export function EngineSlot({
  engine,
  loadErrorTitle,
  renderErrorTitle,
  loadingLabel,
  children,
}: {
  engine: Pick<LazyEngine<object>, 'reset'>;
  loadErrorTitle: string;
  renderErrorTitle: string;
  loadingLabel: string;
  children: ReactNode;
}) {
  return (
    <EngineBoundary
      loadErrorTitle={loadErrorTitle}
      renderErrorTitle={renderErrorTitle}
      onError={engine.reset}>
      <Suspense fallback={<ElementLoading label={loadingLabel} />}>
        {children}
      </Suspense>
    </EngineBoundary>
  );
}
