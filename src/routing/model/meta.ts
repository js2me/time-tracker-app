import { sample, Store } from 'effector';
import { createHashHistory } from 'history';
import { createValueModel } from '@/shared/lib/effector/value-model';
import { getLocationQueryParams } from '../lib';
import { router } from './router';

const initialized = createValueModel(false, { type: 'switch' });

export const $initialized = initialized.$on;

export const initialize = initialized.turnOn;

export const history = createHashHistory();

sample({
  clock: initialize,
  target: router.setHistory.prepend(() => history),
});

history.listen((data) => {
  console.info('history changed data', data);
});

export const baseQueryParams = getLocationQueryParams() as Record<
  string,
  string | undefined
>;

export const querySync = <T>(cfg: {
  source: Store<T>;
  fn?: (value: T) => AnyObject;
}) => {
  sample({
    clock: cfg.source,
    source: router.$query,
    fn: (query, update): AnyObject => ({
      ...query,
      ...(cfg.fn ? cfg.fn(update) : update),
    }),
    target: router.updateQueryParams.prepend((data: AnyObject) => ({
      data,
      method: 'replace',
    })),
  });
};
