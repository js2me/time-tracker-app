import { lazy, Suspense } from 'react';

import { PageLoader } from '@/shared/ui/page-loader';

const LazyPage = lazy(async () => {
  const { AboutPageContent } = await import('./view');
  return { default: AboutPageContent };
});

export const AboutPage = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyPage />
  </Suspense>
);
