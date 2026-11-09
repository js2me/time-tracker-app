import { withViewModel } from 'mobx-view-model-react';
import { lazy, Suspense } from 'react';

import { PageLoader } from '@/shared/ui/page-loader';

const LazyPage = lazy(async () => {
  const [{ AboutPageVM }, { AboutPageView }] = await Promise.all([
    import('./model'),
    import('./view'),
  ]);

  return { default: withViewModel(AboutPageVM, AboutPageView) };
});

export const AboutPage = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyPage />
  </Suspense>
);
