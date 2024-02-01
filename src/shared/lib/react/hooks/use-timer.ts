import { useLayoutEffect, useRef, useState } from 'react';
import { useSyncRef } from '@/shared/lib/react/hooks/use-sync-ref';

interface TimerConfig {
  onFinish?: VoidFunction;
  seconds: number;
}

export const useTimer = (cfg: TimerConfig) => {
  const [timer, setTimer] = useState(-1);
  const [stopped, setStopped] = useState(false);
  const timerIdRef = useRef<number | null>(null);
  const secondsRef = useSyncRef(cfg.seconds);

  useLayoutEffect(() => {
    if (timer === -1) {
      return;
    }

    if (timer === 0) {
      cfg.onFinish?.();
      return;
    }

    if (stopped) {
      return;
    }

    timerIdRef.current = setTimeout(() => {
      setTimer((timer) => timer - 1);
    }, 1000);

    return () => {
      clearTimeout(timerIdRef.current!);
    };
  }, [timer, stopped]);

  const restart = () => {
    setStopped(false);
    setTimer(secondsRef.current);
  };

  const reset = () => {
    setStopped(false);
    setTimer(-1);
  };

  const start = () => {
    setStopped(false);
    setTimer(secondsRef.current);
  };

  const stop = () => {
    setStopped(true);
    clearTimeout(timerIdRef.current!);
  };

  const continueEvent = () => {
    setStopped(false);
  };

  return {
    finished: timer === 0,
    stopped,
    seconds: timer === -1 ? cfg.seconds : timer,
    continue: continueEvent,
    restart,
    start,
    stop,
    reset,
  };
};
