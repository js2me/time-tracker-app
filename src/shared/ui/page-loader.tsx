import { cx } from 'yummies/css';

import { Skeleton } from './generated/skeleton';

export const PageLoader = ({ className }: { className?: string }) => {
  return (
    <div className={cx('relative flex flex-row justify-center', className)}>
      <div className={'flex-none w-full flex flex-col gap-3'}>
        <Skeleton className={'w-full h-[200px] rounded-lg'} />
        <Skeleton className={'w-full h-[80px] rounded-lg'} />
        <Skeleton className={'w-full h-[40px] rounded-lg'} />
        <div className={'flex flex-row gap-3 h-[100px]'}>
          <Skeleton className={'w-full h-full rounded-lg'} />
          <Skeleton className={'w-full h-full rounded-lg'} />
          <Skeleton className={'w-full h-full rounded-lg'} />
        </div>
      </div>
    </div>
  );
};
