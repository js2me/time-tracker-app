import { observer } from 'mobx-react-lite';
import { ViewModelProps } from 'mobx-vm-entities';

import { HomePageVM } from '../model';

import { ActiveLogCard } from './components/active-log-card';
import { ActiveProjectSelector } from './components/active-project-selector';
import { AddProject } from './components/add-project';
import { CopyData } from './components/copy-data';
import { Logs } from './components/logs';
import { LogsTotal } from './components/logs-total';
import { ManualAddLog } from './components/manual-add-log';
import { RateInput } from './components/rate-input';
import { ResetTracking } from './components/reset-tracking';

export const HomePageView = observer(
  ({ model }: ViewModelProps<HomePageVM>) => {
    return (
      <>
        <div>
          <div className={'flex flex-row justify-between'}>
            <div>
              <span className={'text-xs text-muted-foreground'}>проект:</span>
              <div className={'flex w-[260px] flex-row gap-2'}>
                <ActiveProjectSelector />
                <AddProject />
              </div>
            </div>
            <div>
              <span className={'text-xs text-muted-foreground'}>ставка:</span>
              <RateInput />
            </div>
          </div>
          <ActiveLogCard className={'mb-6 mr-auto mt-10 w-full'} />
          {model.hasActiveProject && (
            <div className={'mb-4 flex flex-1 flex-row gap-2'}>
              <ManualAddLog className={'mr-auto'} />

              <ResetTracking />
              <CopyData />
            </div>
          )}
          <LogsTotal />
          <Logs />
        </div>
      </>
    );
  },
);
