import { Route, Router, Switch } from 'wouter';

import { Layout } from '@/pages/_layout';
import { AboutPage } from '@/pages/about';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';

export const Routing = () => (
  <Router base={buildEnvs.BASE_URL}>
    <Switch>
      <Route path={'/'} nest>
        <Router>
          <Layout>
            <Switch>
              <Route path={'about'}>
                <AboutPage />
              </Route>
              <Route path={'*'}>
                <HomePage />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </Route>
      <Route path={'*'}>
        <NotFoundPage />
      </Route>
    </Switch>
  </Router>
);
