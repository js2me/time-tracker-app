import { cx } from 'class-variance-authority';
import { useUnit } from 'effector-react/compat';
import { clamp } from 'lodash-es';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ms } from 'yammies/ms';

import { dataModel } from '@/entities/data';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';

import { ActiveLogTime } from './active-log-time';

export const ActiveLogCard = ({ className }: { className?: string }) => {
  const activeProject = useUnit(dataModel.activeProject);
  const activeLog = useUnit(dataModel.activeLog);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const events = useUnit({
    finishActiveLog: dataModel.finishActiveLog,
    continueActiveLog: dataModel.continueActiveLog,
    pauseActiveLog: dataModel.pauseActiveLog,
    createActiveLog: dataModel.createActiveLog,
  });

  useEffect(() => {
    if (
      activeLog.value &&
      textareaRef.current &&
      activeLog.value.meta !== textareaRef.current.value
    ) {
      textareaRef.current.value = activeLog.value.meta;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!activeLog.value]);

  return (
    <Card
      className={twMerge(
        'flex flex-col items-center justify-center gap-2 p-4',
        className,
      )}
    >
      <h1 className={`inline-flex w-full flex-1 text-xl font-semibold`}>
        Трекер{activeLog.value ? ` (${activeLog.value.projectName})` : ''}
      </h1>
      <Textarea
        ref={textareaRef}
        onChange={(e) => {
          if (activeLog.value) {
            activeLog.update({ meta: e.target.value });
          }
        }}
        className={'!h-[40px] bg-card'}
        placeholder={
          activeLog.value ? 'Чем занимаешься?' : 'Чем будешь заниматься?'
        }
      />
      <div className={'mt-4 flex w-full flex-row items-center gap-2'}>
        {activeLog.value ? (
          <>
            <ActiveLogTime
              className={cx(
                `relative mr-auto flex items-center text-2xl font-bold`,
                {
                  'text-reverse': activeLog.value.status === 'paused',
                  'text-destructive': activeLog.value.status !== 'paused',
                },
              )}
              title={'Сохранение лога начинается от 1 минуты'}
              style={{
                opacity: Math.max(
                  clamp(activeLog.value.spentTime, 0, ms(1, 'min')) /
                    ms(1, 'min'),
                  0.5,
                ),
              }}
              leftContent={
                activeLog.value.status === 'active' && (
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
              disabled={activeLog.value.status === 'active'}
              onClick={() => {
                events.finishActiveLog();
                if (textareaRef.current) {
                  textareaRef.current.value = '';
                }
              }}
            >
              ЗАВЕРШИТЬ
            </Button>
            {activeLog.value.status === 'paused' ? (
              <Button
                style={{ width: 150 }}
                variant={'positive'}
                onClick={events.continueActiveLog}
              >
                ПРОДОЛЖИТЬ
              </Button>
            ) : (
              <Button
                style={{ width: 150 }}
                variant={'outline'}
                className={'bg-card'}
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
            variant={'positive'}
            onClick={() => {
              events.createActiveLog({
                meta: textareaRef.current?.value ?? '',
                lastTickDate: null,
                startDate: new Date().toISOString(),
                spentTime: 0,
                projectName: activeProject.value?.name || '',
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
};
