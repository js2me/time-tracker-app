import { BaseTemplate } from '@/widgets/templates';
import { Skeleton } from '@/shared/ui/skeleton';

export const BaseTemplateLoader = () => {
  return (
    <BaseTemplate>
      <div className={'grid w-full grid-cols-2 gap-5'}>
        <Skeleton className={'h-48'} />
        <Skeleton className={'h-48'} />
        <Skeleton className={'col-span-2 h-48'} />
        <Skeleton className={'h-48'} />
        <Skeleton className={'h-48'} />
        <Skeleton className={'col-span-2 h-48'} />
      </div>
    </BaseTemplate>
  );
};
