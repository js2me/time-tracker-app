import { cn } from '@/shared/lib/shadcn-ui';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-accent opacity-0 fill-mode-forwards',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
