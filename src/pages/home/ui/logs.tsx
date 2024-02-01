import { useStoreMap } from 'effector-react';
import { Fragment } from 'react';
import { dataModel, ProjectLog } from '@/entities/data';
import { hammer } from '@/shared/lib/common/hammer';
import { sanitizeHtml } from '@/shared/lib/common/html';

interface LogGroup {
  label: string;
  logs: ProjectLog[];
}

export const Logs = () => {
  const groupedLogs = useStoreMap(
    dataModel.activeProject.$value,
    (project): LogGroup[] | null => {
      if (!project) return null;

      if (!project.logs.length) return [];

      const records: Record<string, LogGroup> = {};

      project.logs
        .slice()
        .sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        )
        .forEach((log) => {
          const dateLabel = hammer.format.dateTime(log.startDate, {
            format: 'month',
          });

          if (!records[dateLabel]) {
            records[dateLabel] = { label: dateLabel, logs: [] };
          }

          records[dateLabel].logs.push(log);
        });

      return Object.values(records);
    },
  );

  if (!groupedLogs) {
    return (
      <div className={'my-40 text-center text-2xl text-accent'}>
        Проект не выбран
      </div>
    );
  }

  if (!groupedLogs.length) {
    return (
      <div className={'my-40 text-center text-2xl text-accent'}>Нет логов</div>
    );
  }

  return (
    <div className={'max-w-[540px] select-text'}>
      {groupedLogs.map((group) => {
        return (
          <div key={group.label} className={'relative select-text py-4'}>
            <h1 className={'mb-2 select-text text-lg'}>{group.label}</h1>
            <div className={'flex select-text flex-col'}>
              {group.logs.map((log, i) => {
                return (
                  <Fragment key={i}>
                    <div className={'h-1 w-full hover:bg-reverse'}></div>
                    <div className={'relative my-0.5 select-text'}>
                      <div
                        className={
                          'absolute left-0 top-0 h-full w-1 select-text rounded-sm bg-accent'
                        }
                      />
                      <span
                        className={
                          'ml-3 select-text text-sm text-foreground/70'
                        }
                      >
                        {hammer.format.dateTime(log.startDate, {
                          format: 'dddd, D, HH:mm A',
                        })}
                      </span>
                      <span
                        className={'text-foreground/7 0 select-text text-sm'}
                      >
                        {` - ${hammer.format.dateTime(log.spentTime, {
                          format: 'time',
                          asTime: true,
                        })} (${hammer.format.dateTime(
                          Date.now() + log.spentTime,
                          {
                            format: 'spent-time',
                          },
                        )})`}
                      </span>
                      <div
                        className={'ml-3 select-text'}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(log.meta),
                        }}
                      />
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
