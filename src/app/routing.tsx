import { RouteView, RouteViewGroup } from 'mobx-route/react';

import { Layout } from '@/pages/_layout';
import { AboutPage } from '@/pages/about';
import { HomePage } from '@/pages/home';
import { ImportExportPage } from '@/pages/import-export';
import { routes } from '@/shared/lib/routes';

export const Routing = () => (
  <RouteViewGroup layout={Layout} otherwise={routes.home} replace>
    <RouteView route={routes.home} view={HomePage} />
    <RouteView route={routes.about} view={AboutPage} />
    <RouteView route={routes.importExport} view={ImportExportPage} />
  </RouteViewGroup>
);
