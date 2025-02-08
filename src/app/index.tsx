import { observer } from 'mobx-react-lite';
import { ViewModelsProvider } from 'mobx-view-model';
import { ErrorBoundary } from 'react-simple-error-boundary';

import { container, tags } from '@/shared/lib/di';
import { Toaster } from '@/shared/ui/generated/sonner';
import { TooltipProvider } from '@/shared/ui/generated/tooltip';

import { Routing } from './routing';

export const App = observer(() => {
  const viewModels = container.get(tags.viewModels);
  const router = container.get(tags.router);

  return (
    <ViewModelsProvider value={viewModels}>
      <TooltipProvider>
        <ErrorBoundary>
          <Routing
            useHashRouting={router.type === 'hash'}
            baseUrl={router.baseUrl}
          />
        </ErrorBoundary>
        <Toaster position={'bottom-center'} />
      </TooltipProvider>
    </ViewModelsProvider>
  );
});
