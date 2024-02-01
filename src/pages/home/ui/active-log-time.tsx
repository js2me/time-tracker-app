import { useUnit } from 'effector-react';
import { HTMLAttributes } from 'react';
import { dataModel } from '@/entities/data';
import { hammer } from '@/shared/lib/common/hammer';

export const ActiveLogTime = ({
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  const activeLogTime = useUnit(dataModel.$activeLogTime);

  return (
    <span {...props}>
      {children}
      {hammer.format.dateTime(activeLogTime, {
        format: 'time',
        asTime: true,
      })}
    </span>
  );
};
