import { observer } from 'mobx-react-lite';
import { ViewModelsProvider } from 'mobx-vm-entities';
import { ErrorBoundary } from 'react-simple-error-boundary';
import { Route, Router, Switch } from 'wouter';

import { Layout } from '@/pages/_layout';
import { AboutPage } from '@/pages/about';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { useRootStore } from '@/shared/lib/mobx/root-store';
import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

export const App = observer(() => {
  const { viewModels } = useRootStore();

  return (
    <ViewModelsProvider value={viewModels}>
      <TooltipProvider>
        <ErrorBoundary>
          <Router base={buildEnvs.BASE_URL}>
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
        </ErrorBoundary>
        <Toaster position={'bottom-center'} />
      </TooltipProvider>
    </ViewModelsProvider>
  );
});
