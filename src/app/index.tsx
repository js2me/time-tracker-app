import { observer } from 'mobx-react-lite';
import { ErrorBoundary } from 'react-simple-error-boundary';
import { Route, Router, Switch } from 'wouter';

import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

export const App = observer(() => {
  return (
    <TooltipProvider>
      <ErrorBoundary>
        <Router base={import.meta.env.BASE_URL}>
          <Switch>
            <Route path={'/'} component={HomePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </ErrorBoundary>
      <Toaster position={'bottom-center'} />
    </TooltipProvider>
  );
});
