import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';
import { HTMLAttributes, ReactNode } from 'react';
import { formatDate } from 'yummies/date-time';
import { ms } from 'yummies/ms';

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
    const model = useViewModel<HomePageVM>();

    return (
      <span {...props}>
        {leftContent}
        {formatDate(model.timeTracker.activeLogTime, {
          format: 'time',
          asTime: true,
        })}
        <span className={'pl-1 text-xs font-medium text-reverse/60'}>
          {`(${+((model.timeTracker.activeProject?.rate ?? 0) * (model.timeTracker.activeLogTime / ms(1, 'hour'))).toFixed(2)} руб.)`}
        </span>
        {rightContent}
      </span>
    );
  },
);
