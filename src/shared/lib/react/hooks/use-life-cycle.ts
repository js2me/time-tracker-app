import { useEffect, useLayoutEffect } from 'react';

import { useSyncRef } from '@/shared/lib/react/hooks/use-sync-ref';

export const useLifeCycle = (cfg: {
  mount?: VoidFunction;
  unmount?: VoidFunction;
  mounted?: VoidFunction;
  unmounted?: VoidFunction;
}) => {
  const cfgRef = useSyncRef(cfg);

  useLayoutEffect(() => {
    cfgRef.current.mount?.();
    return () => {
      cfgRef.current.unmount?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cfgRef.current.mounted?.();
    return () => {
      cfgRef.current.unmounted?.();
    };
  }, []);
};
