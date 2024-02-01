import { useUnit } from 'effector-react';
import { BaseTemplate } from '@/widgets/templates';
import { dataModel } from '@/entities/data';
import { ActiveLogCard } from './active-log-card';
import { ActiveProjectSelector } from './active-project-selector';
import { AddProject } from './add-project';
import { CopyData } from './copy-data';
import { Logs } from './logs';
import { LogsTotal } from './logs-total';
import { RateInput } from './rate-input';
import { ResetTracking } from './reset-tracking';

export const HomePage = () => {
  const hasActiveProject = useUnit(dataModel.$hasActiveProject);

  return (
    <BaseTemplate className={'flex flex-col'}>
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
        {hasActiveProject && (
          <div className={'mb-4 flex flex-row justify-end gap-2'}>
            <ResetTracking />
            <CopyData />
          </div>
        )}
        <LogsTotal />
        <Logs />
      </div>
    </BaseTemplate>
  );
};
