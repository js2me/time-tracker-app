import { combine, Store } from 'effector';
import { noop } from 'lodash-es';
import { generateId } from '@/shared/lib/common/id';
import { createValueModel } from '@/shared/lib/effector/value-model';
import { when } from '@/shared/lib/effector/when';

/**
 * Принцип работы
 *
 * В корне приложения до рендера App вызывается событие {onAppStart}
 * После этого состояние {$appStarted} будет меняться в зависимости от блокировок приложения,
 * объявленных при помощи метода {block}
 */

const appStartBlockers = createValueModel<string>([], { type: 'list' });

export const appStartCalled = createValueModel(false, { type: 'switch' });

/**
 * Состояние-флаг запущено ли приложение или нет
 */
export const $appStarted = combine(
  appStartCalled.$on,
  appStartBlockers.$size,
  (appStartCalled, blockersCount) => appStartCalled && !blockersCount,
);

/**
 * СОБЫТИЕ, которое будет запущено ПРИ СТАРТЕ ПРИЛОЖЕНИЯ
 */
export const onAppStart = appStartCalled.turnOn.map(noop);

/**
 * СОБЫТИЕ, которое будет запущено ПРИ УСПЕШНОМ СТАРТЕ ПРИЛОЖЕНИЯ
 * То есть когда все блокировки будут решены
 *
 * сами блокировки создаются при помощи метода {blockAppStarting}
 * блокировки решаются уже снаружи приложения
 */
export const onAppStarted = when($appStarted);

/**
 * Создает блокировщик старта приложения
 */
export const blockIf = (store: Store<boolean>) => {
  const blockerId = generateId();

  store.watch((state) => {
    if (state) {
      appStartBlockers.add(blockerId);
    } else {
      appStartBlockers.delete(blockerId);
    }
  });
};
