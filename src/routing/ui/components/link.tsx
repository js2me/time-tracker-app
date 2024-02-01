import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'atomic-router-react';
import { useUnit } from 'effector-react';
import { twMerge } from 'tailwind-merge';
import { Skeleton } from '@/shared/ui/skeleton';

export type LinkProps<Params extends AnyObject> = RouterLinkProps<Params> & {
  disabled?: boolean;
  loading?: boolean;
};

export function Link<Params extends AnyObject>({
  disabled,
  className,
  loading,
  children,
  ...props
}: LinkProps<Params>) {
  const routeActive =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    typeof props.to == 'string' ? false : useUnit(props.to.$isOpened);

  const interactive = !disabled && !routeActive && !loading;

  return (
    <RouterLink
      {...props}
      className={twMerge(
        'relative',
        interactive ? '' : 'pointer-events-none',
        className,
      )}
    >
      {children}
      {loading && <Skeleton />}
    </RouterLink>
  );
}
