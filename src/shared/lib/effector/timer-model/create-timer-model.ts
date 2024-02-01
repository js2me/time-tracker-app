import { combine, createEvent, is, sample } from 'effector';
import { typeGuard } from '@/shared/lib/common/type-guard';
import { always } from '@/shared/lib/effector/always';
import { createValueModel } from '@/shared/lib/effector/value-model';
import { when } from '@/shared/lib/effector/when';
import TimerWorker from './timer-worker?worker';
import { TimerModel, TimerModelConfig } from './types';

export const createTimerModel = ({
  tickDelay: tickDelay,
  maxTicks: maxTicksCount,
}: TimerModelConfig): TimerModel => {
  const timerWorker = new TimerWorker();

  const ticks = createValueModel(0, { type: 'numeric' });
  const running = createValueModel(false, { type: 'switch' });

  const $ticksMs = ticks.$value.map(
    (ticks) => +(ticks * tickDelay).toFixed(10),
  );

  const tick = createEvent();

  const $limit = is.store(maxTicksCount)
    ? maxTicksCount
    : always(maxTicksCount ?? Infinity);

  const $ticksLeft = combine(ticks.$value, $limit, (ticks, limit) => {
    if (typeGuard.isInfinite(limit)) return Infinity;

    return Math.max(limit - ticks, 0);
  });

  const $finished = combine(
    running.$on,
    ticks.$value,
    (running, ticks) => !running && ticks !== 0,
  );

  timerWorker.addEventListener('message', (message) => {
    if (message.data.type === 'tick') {
      tick();
    }
  });

  sample({
    clock: running.turnOn,
    target: ticks.reset,
  });

  sample({
    clock: tick,
    target: ticks.increment,
  });

  running.turnOn.watch(() => {
    timerWorker.postMessage({
      type: 'start',
      delay: tickDelay,
    });
  });

  running.turnOff.watch(() => {
    timerWorker.postMessage({
      type: 'stop',
    });
  });

  if ($limit) {
    sample({
      clock: ticks.$value,
      source: $limit,
      filter: (limit, ticks) => ticks >= limit,
      target: running.turnOff,
    });
  }

  return {
    $running: running.$on,
    $finished,
    $ticks: ticks.$value,
    $ticksLeft,
    $ticksMs,

    start: running.turnOn,
    stop: running.turnOff,
    finished: when($finished),
    tick,
  };
};
