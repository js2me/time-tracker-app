import { Skeleton } from '@/shared/ui/skeleton';

export const ModalRouteLoader = () => (
  <div
    className={'relative grid grid-cols-2 gap-3 p-8 pt-14'}
    style={{ height: `70vh` }}
  >
    <Skeleton className={'relative col-span-1 rounded-md'} />
    <Skeleton className={'relative col-span-1 rounded-md'} />
    <Skeleton className={'relative col-span-2 rounded-md'} />
    <Skeleton className={'relative col-span-1 rounded-md'} />
    <Skeleton className={'relative col-span-1 rounded-md'} />
    <Skeleton className={'relative col-span-2 rounded-md'} />
  </div>
);
