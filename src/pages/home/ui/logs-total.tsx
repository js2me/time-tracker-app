import { useUnit } from 'effector-react';
import { dataModel } from '@/entities/data';

export const LogsTotal = () => {
  const totalLabel = useUnit(dataModel.$logsLabels);

  if (!totalLabel) return null;

  return (
    <div className={'select-text text-sm font-semibold'}>{totalLabel}</div>
  );
};
