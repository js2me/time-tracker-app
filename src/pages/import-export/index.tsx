import { withViewModel } from 'mobx-view-model-react';
import { lazy, Suspense } from 'react';

import { PageLoader } from '@/shared/ui/page-loader';

const LazyPage = lazy(async () => {
  const [{ ImportExportPageVM }, { ImportExportPageView }] = await Promise.all([
    import('./model'),
    import('./view'),
  ]);

  return { default: withViewModel(ImportExportPageVM, ImportExportPageView) };
});

export const ImportExportPage = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyPage />
  </Suspense>
);
