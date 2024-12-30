import { useUnit } from 'effector-react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { ViewModelProps } from 'mobx-vm-entities';
import { ReactNode } from 'react';
import { cx } from 'yammies/css';

import { dataModel } from '@/entities/data';
import { logoImageUrl } from '@/shared/assets';
import { useRootStore } from '@/shared/lib/mobx/root-store';
import { Button } from '@/shared/ui/button';

import { LayoutVM } from './model';

interface LayoutViewProps extends ViewModelProps<LayoutVM> {
  className?: string;
  children?: ReactNode;
  customLogoClick?: VoidFunction;
}

export const LayoutView = observer(
  ({ children, customLogoClick, model }: LayoutViewProps) => {
    const { theme } = useRootStore();

    const logoAnimating = useUnit(dataModel.$activeLogIsActive);

    const handleLogoClick = () => {
      if (customLogoClick) {
        return customLogoClick();
      }

      model.handleClickLogo();
    };

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
            className={`h-14 rounded-sm text-reverse max-xs:h-10 ${
              logoAnimating ? 'animate-pulse duration-1000' : ''
            }`}
          />
          <h1
            className={'cursor-pointer text-3xl font-extrabold tracking-tight'}
            onClick={handleLogoClick}
          >
            Тайм Трекер Машина
          </h1>
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
        {children}
      </div>
    );
  },
);
