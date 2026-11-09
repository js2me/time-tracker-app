import { lazy, Suspense } from 'react';

import { PageLoader } from '@/shared/ui/page-loader';

const LazyPage = lazy(async () => {
  const { ImportExportPageContent } = await import('./view');
  return { default: ImportExportPageContent };
});

export const ImportExportPage = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyPage />
  </Suspense>
);
