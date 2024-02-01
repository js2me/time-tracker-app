import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/shadcn-ui';
import { ButtonProps, buttonVariants } from '@/shared/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role={'navigation'}
    aria-label={'pagination'}
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size' | 'disabled'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  disabled,
  ...props
}: PaginationLinkProps) => (
  <PaginationItem>
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: !disabled && isActive ? 'outline' : 'ghost',
          size,
        }),
        disabled
          ? 'opacity-40 hover:bg-transparent cursor-default pointer-events-none'
          : '',
        className,
      )}
      {...props}
    />
  </PaginationItem>
);
PaginationLink.displayName = 'PaginationLink';

const PaginationFirst = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label={'Go to first page'}
    size={'default'}
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronsLeft className={'h-4 w-4'} />
  </PaginationLink>
);
PaginationFirst.displayName = 'PaginationFirst';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label={'Go to previous page'}
    size={'default'}
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className={'h-4 w-4'} />
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label={'Go to next page'}
    size={'default'}
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <ChevronRight className={'h-4 w-4'} />
  </PaginationLink>
);

const PaginationLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label={'Go to last page'}
    size={'default'}
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronsRight className={'h-4 w-4'} />
  </PaginationLink>
);
PaginationLast.displayName = 'PaginationLast';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className={'h-4 w-4'} />
    <span className={'sr-only'}>More pages</span>
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationFirst,
  PaginationLink,
  PaginationNext,
  PaginationLast,
  PaginationPrevious,
};
