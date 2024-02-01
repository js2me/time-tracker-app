import { useUnit } from 'effector-react';
import { FC } from 'react';
import { Router } from '@/routing';
import { BaseTemplateLoader } from '@/widgets/templates';
import { appStartModel, useAppStarter } from '@/shared/_entities/app-starter';
import { DialogsContainer } from '@/shared/_entities/dialog';
import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

import './start';

export const App: FC = () => {
  const appStarted = useUnit(appStartModel.$appStarted);

  useAppStarter();

  return (
    <>
      <TooltipProvider>
        {appStarted ? (
          <>
            <Router>
              <DialogsContainer />
            </Router>
          </>
        ) : (
          <BaseTemplateLoader />
        )}
        <Toaster position={'bottom-center'} />
      </TooltipProvider>
    </>
  );
};
