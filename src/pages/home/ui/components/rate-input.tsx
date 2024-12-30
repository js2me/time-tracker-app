import { useUnit } from 'effector-react';

import { dataModel } from '@/entities/data';
import { Input } from '@/shared/ui/input';

export const RateInput = () => {
  const activeProject = useUnit(dataModel.activeProject);

  if (!activeProject.value) return null;

  return (
    <Input
      type={'number'}
      placeholder={'0'}
      className={'max-w-[140px]'}
      value={activeProject.value.rate || ''}
      onChange={(e) => {
        activeProject.update({ rate: +e.target.value || 0 });
      }}
    />
  );
};
