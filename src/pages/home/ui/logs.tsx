import { useStoreMap } from 'effector-react';
import { dataModel, ProjectLog } from '@/entities/data';
import { hammer } from '@/shared/lib/common/hammer';
import { Log } from './log';

interface LogGroup {
  label: string;
  logs: (ProjectLog & { index: number })[];
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
        .map((log, index) => ({ ...log, index }))
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
            <h1
              className={
                'sticky top-0 z-10 mb-2 select-text bg-custom-background/50 text-lg backdrop-blur-md'
              }
            >
              {group.label}
            </h1>
            <div className={'flex select-text flex-col'}>
              {group.logs.map((log, i) => {
                return <Log key={i} log={log} index={log.index} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
