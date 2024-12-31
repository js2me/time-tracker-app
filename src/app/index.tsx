import { observer } from 'mobx-react-lite';
import { ErrorBoundary } from 'react-simple-error-boundary';
import { Route, Router, Switch } from 'wouter';

import { Layout } from '@/pages/_layout';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

export const App = observer(() => {
  return (
    <TooltipProvider>
      <ErrorBoundary>
        <Router base={'/time-tracker-app'}>
          <Switch>
            <Route path={'/'}>
              <Layout>
                <HomePage />
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
  );
});
