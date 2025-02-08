import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-view-model';

import { HomePageVM } from '../../model';

export const LogsTotal = observer(() => {
  const { timeTracker: data } = useViewModel<HomePageVM>();

  if (!data.logsLabels) return null;

  return (
    <div className={'select-text p-1 text-sm font-semibold'}>
      {data.logsLabels}
    </div>
  );
});
