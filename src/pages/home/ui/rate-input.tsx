import { useUnit } from 'effector-react';
import { dataModel } from '@/entities/data';
import { Input } from '@/shared/ui/input';

export const RateInput = () => {
  const rate = useUnit(dataModel.rate);

  return (
    <Input
      type={'number'}
      placeholder={'0'}
      className={'max-w-[140px]'}
      value={rate.value || ''}
      onChange={(e) => {
        rate.set(+e.target.value || 0);
      }}
    />
  );
};
