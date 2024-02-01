import { attachLogger } from 'effector-logger';
import ResizeObserver from 'resize-observer-polyfill';

if (buildEnvs.POLYFILLS.RESIZE_OBSERVER) {
  if (!window.ResizeObserver) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
  }
}

if (buildEnvs.LOGGER) {
  attachLogger();
}
