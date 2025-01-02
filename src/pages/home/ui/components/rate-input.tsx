import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';

import { Input } from '@/shared/ui/input';

import { HomePageVM } from '../../model';

export const RateInput = observer(() => {
  const { timeTracker: data } = useViewModel<HomePageVM>();
  if (!data.activeProject) return null;

  return (
    <Input
      type={'number'}
      placeholder={'0'}
      className={'max-w-[140px]'}
      value={data.activeProject.rate || ''}
      onChange={(e) => {
        data.setRateForActiveProject(+e.target.value || 0);
      }}
    />
  );
});
