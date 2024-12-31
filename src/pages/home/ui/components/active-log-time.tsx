import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';
import { HTMLAttributes, ReactNode } from 'react';
import { formatDate } from 'yammies/date-time';
import { ms } from 'yammies/ms';

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
    const { data } = useViewModel<HomePageVM>();

    return (
      <span {...props}>
        {leftContent}
        {formatDate(data.activeLogTime, {
          format: 'time',
          asTime: true,
        })}
        <span className={'pl-1 text-xs font-medium text-reverse/60'}>
          {`(${+((data.activeProject?.rate ?? 0) * (data.activeLogTime / ms(1, 'hour'))).toFixed(2)} руб.)`}
        </span>
        {rightContent}
      </span>
    );
  },
);
