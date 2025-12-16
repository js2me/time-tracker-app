import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

import { Layout } from '@/pages/_layout';
import { AboutPage } from '@/pages/about';
import { HomePage } from '@/pages/home';
import { ImportExportPage } from '@/pages/import-export';
import { NotFoundPage } from '@/pages/not-found';

export const Routing = ({
  useHashRouting,
  baseUrl,
}: {
  useHashRouting?: boolean;
  baseUrl?: string;
}) => (
  <Router base={baseUrl}>
    <Router hook={useHashRouting ? useHashLocation : undefined}>
      <Switch>
        <Route path={'/'}>
          <Layout>
            <HomePage />
          </Layout>
        </Route>
        <Route path={'/about'}>
          <Layout>
            <AboutPage />
          </Layout>
        </Route>
        <Route path={'/import-export'}>
          <Layout>
            <ImportExportPage />
          </Layout>
        </Route>
        <Route path={'*'}>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  </Router>
);
