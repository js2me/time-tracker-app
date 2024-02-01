import { useUnit } from 'effector-react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { baseTemplateModel } from '@/widgets/templates';
import { dataModel } from '@/entities/data';
import { themeModel } from '@/shared/_entities/theme';
import { logoImageUrl } from '@/shared/assets';
import { Button } from '@/shared/ui/button';

interface BaseTemplateProps {
  className?: string;
  children?: ReactNode;
  customLogoClick?: VoidFunction;
}

export const BaseTemplate = ({
  children,
  className,
  customLogoClick,
}: BaseTemplateProps) => {
  baseTemplateModel.view.useConnect();

  const [clickLogo] = useUnit([baseTemplateModel.logoClicked]);
  const theme = useUnit(themeModel.theme);

  const logoAnimating = useUnit(dataModel.$activeLogIsActive);

  const handleLogoClick = () => {
    if (customLogoClick) {
      return customLogoClick();
    }

    clickLogo();
  };

  return (
    <div
      className={twMerge(
        'relative mx-auto min-h-full py-10 flex flex-col max-lg:px-6 max-md:py-6 max-xs:p-4  max-w-[640px]',
        className,
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
          onClick={() => {
            if (theme.value === 'light') {
              theme.set('auto');
            } else if (theme.value === 'auto') {
              theme.set('dark');
            } else if (theme.value === 'dark') {
              theme.set('light');
            }
          }}
        >
          {theme.value === 'light' && <Sun />}
          {theme.value === 'auto' && <SunMoon />}
          {theme.value === 'dark' && <Moon />}
        </Button>
      </div>
      {children}
    </div>
  );
};
