import { Moon, Sun, SunMoon } from 'lucide-react';
import { container } from 'mobidic';
import { observer } from 'mobx-react-lite';
import { ViewModelProps } from 'mobx-vm-entities';
import { ReactNode } from 'react';
import { Link } from 'wouter';
import { cx } from 'yummies/css';

import { logoImageUrl } from '@/shared/assets';
import { tags } from '@/shared/lib/di';
import { Button } from '@/shared/ui/generated/button';

import { LayoutVM } from './model';

interface LayoutViewProps extends ViewModelProps<LayoutVM> {
  className?: string;
  children?: ReactNode;
}

export const LayoutView = observer(({ children, model }: LayoutViewProps) => {
  const theme = container.get(tags.theme);
  const router = container.get(tags.router);

  return (
    <div
      className={cx(
        'relative mx-auto min-h-full py-10 flex flex-col max-lg:px-6 max-md:py-6 max-xs:p-4 max-w-[640px]',
      )}
    >
      <div
        className={
          'mb-5 flex flex-row items-center justify-start gap-4 lg:mb-10'
        }
      >
        <img
          alt={'Тайм трекер машина'}
          src={logoImageUrl}
          onClick={model.handleClickLogo}
          className={`size-16 rounded-sm text-reverse max-xs:size-10 cursor-pointer ${
            model.isLogoAnimating ? 'animate-pulse duration-1000' : ''
          }`}
        />
        <div className={'relative'}>
          <h1
            className={'cursor-pointer text-3xl font-extrabold tracking-tight'}
            onClick={model.handleClickLogo}
          >
            Тайм Трекер Машина
          </h1>
          <Link
            href={'/about'}
            onClick={(e) => {
              e.preventDefault();
              router.navigate('/about');
            }}
            className={'text-xs absolute -bottom-3.5 left-0 text-link'}
          >
            О проекте
          </Link>
        </div>
        <Button
          variant={'ghost'}
          size={'icon'}
          className={'ml-auto'}
          onClick={theme.switchTheme}
        >
          {theme.theme === 'light' && <Sun />}
          {theme.theme === 'auto' && <SunMoon />}
          {theme.theme === 'dark' && <Moon />}
        </Button>
      </div>
      <div className={'flex flex-col relative'}>{children}</div>
    </div>
  );
});
