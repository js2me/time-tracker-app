import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-view-model';

import { Input } from '@/shared/ui/generated/input';

import { HomePageVM } from '../../model';

export const RateInput = observer(() => {
  const model = useViewModel<HomePageVM>();

  if (!model.timeTracker.activeProject) {
    return null;
  }

  return (
    <Input
      type={'number'}
      placeholder={'0'}
      className={'max-w-[140px]'}
      value={model.timeTracker.activeProject.rate || ''}
      onChange={(e) => {
        model.setRateForActiveProject(+e.target.value || 0);
      }}
    />
  );
});
