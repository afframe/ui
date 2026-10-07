import { render } from '@testing-library/react';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { Modal } from '../../index.js';

// Guards the local patch of Carbon's usePresence (patches/): unmounting a
// modal during its exit animation cancels the animation, and the rejected
// `animation.finished` must not escape as an unhandled rejection.
const rejections: unknown[] = [];
const onRejection = (event: PromiseRejectionEvent) => {
  rejections.push(event.reason);
  event.preventDefault();
};

beforeEach(() => {
  rejections.length = 0;
  window.addEventListener('unhandledrejection', onRejection);
});

afterEach(() => {
  window.removeEventListener('unhandledrejection', onRejection);
});

function TestModal({ open }: { open: boolean }) {
  return (
    <AfframeProvider>
      <Modal
        open={open}
        modalHeading="Heading"
        primaryButtonText="Save"
        secondaryButtonText="Cancel">
        Body
      </Modal>
    </AfframeProvider>
  );
}

test('unmounting a modal mid exit animation leaves no unhandled rejection', async () => {
  const { rerender, unmount } = render(<TestModal open />);
  rerender(<TestModal open={false} />);
  await expect
    .poll(() =>
      document
        .getAnimations()
        .some(
          (animation) =>
            animation instanceof CSSAnimation &&
            animation.animationName.startsWith('cds--presence') &&
            animation.playState === 'running'
        )
    )
    .toBe(true);
  unmount();
  // Rejections are reported after the microtask queue drains.
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(rejections).toEqual([]);
});
