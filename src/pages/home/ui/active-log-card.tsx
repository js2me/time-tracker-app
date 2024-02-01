import { useUnit } from 'effector-react/compat';
import { twMerge } from 'tailwind-merge';
import { dataModel } from '@/entities/data';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';
import { ActiveLogTime } from './active-log-time';
import { ManualAddLog } from './manual-add-log';

export const ActiveLogCard = ({ className }: { className?: string }) => {
  const activeProject = useUnit(dataModel.activeProject);
  const activeLog = useUnit(dataModel.activeLog);

  const events = useUnit({
    finishActiveLog: dataModel.finishActiveLog,
    continueActiveLog: dataModel.continueActiveLog,
    pauseActiveLog: dataModel.pauseActiveLog,
    createActiveLog: dataModel.createActiveLog,
  });

  return (
    <Card
      className={twMerge(
        'flex flex-col items-center justify-center gap-2 p-4',
        className,
      )}
    >
      <h1 className={`inline-flex w-full flex-1 text-xl font-semibold`}>
        Трекер{activeLog.value ? ` (${activeLog.value.projectName})` : ''}
        <ManualAddLog className={'ml-auto'} />
      </h1>
      <Textarea
        value={activeLog.value?.meta || ''}
        onChange={(e) => activeLog.update({ meta: e.target.value })}
        className={'!h-[40px]'}
        placeholder={'Чем занимаешься?'}
        disabled={!activeLog.value}
      />
      <div className={'mt-4 flex w-full flex-row items-center gap-2'}>
        {activeLog.value ? (
          <>
            <ActiveLogTime
              className={`relative mr-auto flex items-center text-2xl font-bold ${
                activeLog.value.status === 'paused'
                  ? 'text-reverse'
                  : 'text-destructive'
              }`}
            >
              {activeLog.value.status === 'active' && (
                <>
                  <span className={'relative mr-2 flex h-4 w-4'}>
                    <span
                      className={
                        'absolute block h-full w-full animate-ping rounded-full bg-destructive opacity-75'
                      }
                    ></span>
                    <span
                      className={
                        'relative block h-4 w-4 rounded-full bg-destructive'
                      }
                    ></span>
                  </span>
                </>
              )}
            </ActiveLogTime>
            <Button
              variant={
                activeLog.value.status === 'active'
                  ? 'destructive'
                  : 'destructive'
              }
              disabled={activeLog.value.status === 'active'}
              onClick={events.finishActiveLog}
            >
              ЗАВЕРШИТЬ
            </Button>
            {activeLog.value.status === 'paused' ? (
              <Button
                style={{ width: 150 }}
                variant={'default'}
                onClick={events.continueActiveLog}
              >
                ПРОДОЛЖИТЬ
              </Button>
            ) : (
              <Button
                style={{ width: 150 }}
                variant={'outline'}
                onClick={events.pauseActiveLog}
              >
                ПАУЗА
              </Button>
            )}
          </>
        ) : (
          <Button
            disabled={!activeProject.value}
            className={'ml-auto'}
            onClick={() =>
              events.createActiveLog({
                meta: '',
                lastTickDate: null,
                startDate: new Date().toISOString(),
                spentTime: 0,
                projectName: activeProject.value?.name || '',
                status: 'active',
              })
            }
          >
            ПРИСТУПИТЬ К РАБОТЕ
          </Button>
        )}
      </div>
    </Card>
  );
};
