import { Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

import { Layout } from '@/pages/_layout';
import { AboutPage } from '@/pages/about';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';

export const Routing = () => (
  <Router base={buildEnvs.BASE_URL} hook={useHashLocation}>
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
      <Route path={'*'}>
        <NotFoundPage />
      </Route>
    </Switch>
  </Router>
);
