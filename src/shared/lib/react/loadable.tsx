import React, { ComponentType, lazy, Suspense } from 'react';

import { fetchLazyModule } from '@/shared/lib/common/imports';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoadableComponentFn<P = Record<string, any>> = () => Promise<
  ComponentType<P>
>;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function loadable<P = any>(
  loadFn: LoadableComponentFn<P>,
  Fallback: ComponentType = () => null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ExtraComponent?: ComponentType<any>,
): ComponentType<P> {
  const LazyComponent = lazy(async () => ({
    default: await fetchLazyModule(loadFn),
  }));

  // eslint-disable-next-line react/display-name
  return (props?: P) => (
    <Suspense fallback={<Fallback {...props} />}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <LazyComponent {...(props as any)} />
      {ExtraComponent && <ExtraComponent />}
    </Suspense>
  );
}
