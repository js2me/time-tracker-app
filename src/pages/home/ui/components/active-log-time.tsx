import { useStoreMap, useUnit } from 'effector-react';
import { observer } from 'mobx-react-lite';
import { HTMLAttributes, ReactNode } from 'react';
import { formatDate } from 'yammies/date-time';
import { ms } from 'yammies/ms';

import { dataModel } from '@/entities/data';
import { useViewModel } from 'mobx-vm-entities';
import { HomePageVM } from '../../model';

export const ActiveLogTime = observer(
  ({
    leftContent,
    rightContent,
    ...props
  }: HTMLAttributes<HTMLSpanElement> & {
    rightContent?: ReactNode;
    leftContent?: ReactNode;
  }) => {
    const { data, rate } = useViewModel<HomePageVM>()
    const activeLogTime = useUnit(dataModel.$activeLogTime);
    const rate = useStoreMap(
      dataModel.activeProject.$value,
      (project) => project?.rate || 0,
    );

    return (
      <span {...props}>
        {leftContent}
        {formatDate(activeLogTime, {
          format: 'time',
          asTime: true,
        })}
        <span className={'pl-1 text-xs font-medium text-reverse/60'}>
          {`(${+(rate * (activeLogTime / ms(1, 'hour'))).toFixed(2)} руб.)`}
        </span>
        {rightContent}
      </span>
    );
  },
);
