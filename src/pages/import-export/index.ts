import { withLazyPageViewModel } from 'mobx-wouter';

import { PageLoader } from '@/shared/ui/page-loader';

export const ImportExportPage = withLazyPageViewModel(
  async () => {
    const [{ ImportExportPageVM }, { ImportExportPageView }] =
      await Promise.all([import('./model'), import('./view')]);

    return {
      Model: ImportExportPageVM,
      View: ImportExportPageView,
    };
  },
  {
    fallback: PageLoader,
  },
);
