import { Effect, sample } from 'effector';
import { delay } from 'patronum';
import { createValueModel } from '@/shared/lib/effector/value-model';

/**
 * Принцип работы
 *
 * Когда эффект упадет с ошибкой, то он будет запущен повторно с последними параметрами
 * промежуток между попытками значение поля retryDelay
 *
 * промежуток между попытками будет увеличиваться с каждым шагом
 */
export const incrementalRetry = (cfg: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  effect: Effect<any, any, any>;
  retryDelay: number;
  maxRetries?: number;
  maxDelay?: number;
}) => {
  const delayMultiplier = createValueModel(1, { type: 'numeric' });

  delay({
    source: sample({
      clock: cfg.effect.fail.map((it) => it.params),
      filter: delayMultiplier.$value.map(
        (multiplier) => cfg.maxRetries == null || cfg.maxRetries < multiplier,
      ),
    }),
    timeout: delayMultiplier.$value.map((multiplier) => {
      const delay = multiplier * cfg.retryDelay;

      if (cfg.maxDelay == null) return delay;

      return Math.min(delay, cfg.maxDelay);
    }),
    target: [cfg.effect, delayMultiplier.increment],
  });

  sample({
    clock: cfg.effect.done,
    target: [delayMultiplier.reset],
  });
};
