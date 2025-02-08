import { cx } from 'class-variance-authority';
import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-view-model';
import { useEffect, useRef } from 'react';
import { ms } from 'yummies/ms';

import { Button } from '@/shared/ui/generated/button';
import { Card } from '@/shared/ui/generated/card';
import { Textarea } from '@/shared/ui/generated/textarea';

import { HomePageVM } from '../../model';

import { ActiveLogTime } from './active-log-time';

export const ActiveLogCard = observer(
  ({ className }: { className?: string }) => {
    const model = useViewModel<HomePageVM>();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (
        model.timeTracker.activeLog &&
        textareaRef.current &&
        model.timeTracker.activeLog.meta !== textareaRef.current.value
      ) {
        textareaRef.current.value = model.timeTracker.activeLog.meta;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model.timeTracker.hasActiveLog]);

    return (
      <Card
        className={cx(
          'flex flex-col items-center justify-center gap-2 p-4',
          className,
        )}
      >
        <h1 className={`inline-flex w-full flex-1 text-xl font-semibold`}>
          Трекер
          {model.timeTracker.activeLog
            ? ` (${model.timeTracker.activeLog.projectName})`
            : ''}
        </h1>
        <Textarea
          ref={textareaRef}
          onChange={(e) => {
            model.udpateActiveLog({ meta: e.target.value });
          }}
          className={'!h-[40px] bg-card'}
          placeholder={
            model.timeTracker.activeLog
              ? 'Чем занимаешься?'
              : 'Чем будешь заниматься?'
          }
        />
        <div className={'mt-4 flex w-full flex-row items-center gap-2'}>
          {model.timeTracker.activeLog ? (
            <>
              <ActiveLogTime
                className={cx(
                  `relative mr-auto flex items-center text-2xl font-bold`,
                  {
                    'text-reverse':
                      model.timeTracker.activeLog.status === 'paused',
                    'text-destructive':
                      model.timeTracker.activeLog.status !== 'paused',
                  },
                )}
                title={'Сохранение лога начинается от 1 минуты'}
                style={{
                  opacity: Math.max(
                    model.timeTracker.activeLogTimeWithMinLimit / ms(1, 'min'),
                    0.5,
                  ),
                }}
                leftContent={
                  model.timeTracker.activeLog.status === 'active' && (
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
                  )
                }
              />
              <Button
                variant={'destructive'}
                disabled={model.timeTracker.activeLog.status === 'active'}
                onClick={() => {
                  model.finishActiveLog();
                  if (textareaRef.current) {
                    textareaRef.current.value = '';
                  }
                }}
              >
                ЗАВЕРШИТЬ
              </Button>
              {model.timeTracker.activeLog.status === 'paused' ? (
                <Button
                  style={{ width: 150 }}
                  variant={'positive'}
                  onClick={model.continueActiveLog}
                >
                  ПРОДОЛЖИТЬ
                </Button>
              ) : (
                <Button
                  style={{ width: 150 }}
                  variant={'outline'}
                  className={'bg-card'}
                  onClick={model.pauseActiveLog}
                >
                  ПАУЗА
                </Button>
              )}
            </>
          ) : (
            <Button
              disabled={!model.timeTracker.activeProject}
              className={'ml-auto'}
              variant={'positive'}
              onClick={() => {
                model.createActiveLog({
                  meta: textareaRef.current?.value ?? '',
                  lastTickDate: null,
                  startDate: new Date().toISOString(),
                  spentTime: 0,
                  projectName: model.timeTracker.activeProject?.name ?? '',
                  status: 'active',
                });
              }}
            >
              ПРИСТУПИТЬ К РАБОТЕ
            </Button>
          )}
        </div>
      </Card>
    );
  },
);
