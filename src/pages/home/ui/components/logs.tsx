import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';

import { HomePageVM } from '../../model';

import { Log } from './log';

export const Logs = observer(() => {
  const { groupedLogs } = useViewModel<HomePageVM>();

  if (!groupedLogs) {
    return (
      <div className={'my-40 text-center text-2xl text-accent'}>
        Проект не выбран
      </div>
    );
  }

  if (groupedLogs.length === 0) {
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
              {group.logs.map((log, index) => {
                return (
                  <Log
                    key={`${index}_${log.index}  `}
                    log={log}
                    index={log.index}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});
