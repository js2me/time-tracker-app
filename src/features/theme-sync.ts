import { createEffect, sample } from 'effector';
import { appStartModel } from '@/shared/_entities/app-starter';
import { ColorScheme, themeModel } from '@/shared/_entities/theme';

const applyColorSchemeFx = createEffect((colorScheme: ColorScheme) => {
  if (colorScheme === 'light') {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
  }
});

sample({
  clock: [
    themeModel.$colorScheme,
    appStartModel.onAppStarted,
    appStartModel.onAppStart,
  ],
  source: themeModel.$colorScheme,
  target: applyColorSchemeFx,
});
