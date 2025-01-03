import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/shadcn-ui';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        positive: 'border-transparent bg-positive text-positive-foreground',
        reverse: 'border-transparent bg-reverse text-reverse-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        small: 'px-1.5 text-xs',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
    compoundVariants: [
      {
        variant: 'default',
        interactive: true,
        className: 'hover:bg-primary/80',
      },
      {
        variant: 'secondary',
        interactive: true,
        className: 'hover:bg-secondary/80',
      },
      {
        variant: 'reverse',
        interactive: true,
        className: 'hover:bg-reverse/80',
      },
      {
        variant: 'destructive',
        interactive: true,
        className: 'hover:bg-destructive/80',
      },
    ],
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, onClick, ...props }: BadgeProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        badgeVariants({ variant, size, interactive: !!onClick }),
        className,
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
