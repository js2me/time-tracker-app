import { withLazyPageViewModel } from 'mobx-wouter';

import { PageLoader } from '@/shared/ui/page-loader';

export const AboutPage = withLazyPageViewModel(
  async () => {
    const [{ AboutPageVM }, { AboutPageView }] = await Promise.all([
      import('./model'),
      import('./view'),
    ]);

    return {
      Model: AboutPageVM,
      View: AboutPageView,
    };
  },
  {
    fallback: PageLoader,
  },
);
