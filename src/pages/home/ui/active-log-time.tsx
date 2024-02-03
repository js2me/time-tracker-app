import { useStoreMap, useUnit } from 'effector-react';
import { HTMLAttributes, ReactNode } from 'react';
import { dataModel } from '@/entities/data';
import { hammer } from '@/shared/lib/common/hammer';
import { ms } from '@/shared/lib/common/ms';

export const ActiveLogTime = ({
  leftContent,
  rightContent,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  rightContent?: ReactNode;
  leftContent?: ReactNode;
}) => {
  const activeLogTime = useUnit(dataModel.$activeLogTime);
  const rate = useStoreMap(
    dataModel.activeProject.$value,
    (project) => project?.rate || 0,
  );

  return (
    <span {...props}>
      {leftContent}
      {hammer.format.dateTime(activeLogTime, {
        format: 'time',
        asTime: true,
      })}
      <span className={'pl-1 text-xs font-medium text-reverse/60'}>
        {`(${+(rate * (activeLogTime / ms(1, 'hour'))).toFixed(2)} руб.)`}
      </span>
      {rightContent}
    </span>
  );
};
