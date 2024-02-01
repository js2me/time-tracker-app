import { Event, is, sample, Store } from 'effector';
import { memoize, noop } from 'lodash-es';

/**
 * Когда значение внутри store будет иметь истинное значение,
 * тогда возвращаемое событие из этой функции будет вызвано
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const when = memoize((store: Store<any>) => {
  if (!is.store(store)) {
    throw 'unit should be store';
  }

  return sample({
    clock: store,
    filter: Boolean,
    fn: noop,
  }) satisfies Event<void>;
});
