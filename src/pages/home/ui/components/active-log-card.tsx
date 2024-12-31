import { cx } from 'class-variance-authority';
import { clamp } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';
import { useEffect, useRef } from 'react';
import { ms } from 'yammies/ms';

import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Textarea } from '@/shared/ui/textarea';

import { HomePageVM } from '../../model';

import { ActiveLogTime } from './active-log-time';

export const ActiveLogCard = observer(
  ({ className }: { className?: string }) => {
    const { data } = useViewModel<HomePageVM>();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (
        data.activeLog &&
        textareaRef.current &&
        data.activeLog.meta !== textareaRef.current.value
      ) {
        textareaRef.current.value = data.activeLog.meta;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!!data.activeLog]);

    return (
      <Card
        className={cx(
          'flex flex-col items-center justify-center gap-2 p-4',
          className,
        )}
      >
        <h1 className={`inline-flex w-full flex-1 text-xl font-semibold`}>
          Трекер{data.activeLog ? ` (${data.activeLog.projectName})` : ''}
        </h1>
        <Textarea
          ref={textareaRef}
          onChange={(e) => {
            data.udpateActiveLog({ meta: e.target.value });
          }}
          className={'!h-[40px] bg-card'}
          placeholder={
            data.activeLog ? 'Чем занимаешься?' : 'Чем будешь заниматься?'
          }
        />
        <div className={'mt-4 flex w-full flex-row items-center gap-2'}>
          {data.activeLog ? (
            <>
              <ActiveLogTime
                className={cx(
                  `relative mr-auto flex items-center text-2xl font-bold`,
                  {
                    'text-reverse': data.activeLog.status === 'paused',
                    'text-destructive': data.activeLog.status !== 'paused',
                  },
                )}
                title={'Сохранение лога начинается от 1 минуты'}
                style={{
                  opacity: Math.max(
                    clamp(data.activeLog.spentTime, 0, ms(1, 'min')) /
                      ms(1, 'min'),
                    0.5,
                  ),
                }}
                leftContent={
                  data.activeLog.status === 'active' && (
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
                disabled={data.activeLog.status === 'active'}
                onClick={() => {
                  data.finishActiveLog();
                  if (textareaRef.current) {
                    textareaRef.current.value = '';
                  }
                }}
              >
                ЗАВЕРШИТЬ
              </Button>
              {data.activeLog.status === 'paused' ? (
                <Button
                  style={{ width: 150 }}
                  variant={'positive'}
                  onClick={data.continueActiveLog}
                >
                  ПРОДОЛЖИТЬ
                </Button>
              ) : (
                <Button
                  style={{ width: 150 }}
                  variant={'outline'}
                  className={'bg-card'}
                  onClick={data.pauseActiveLog}
                >
                  ПАУЗА
                </Button>
              )}
            </>
          ) : (
            <Button
              disabled={!data.activeProject}
              className={'ml-auto'}
              variant={'positive'}
              onClick={() => {
                data.createActiveLog({
                  meta: textareaRef.current?.value ?? '',
                  lastTickDate: null,
                  startDate: new Date().toISOString(),
                  spentTime: 0,
                  projectName: data.activeProject?.name ?? '',
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
