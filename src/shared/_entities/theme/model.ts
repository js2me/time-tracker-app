import { combine } from 'effector';
import { createValueModel } from '@/shared/lib/effector/value-model';
import { getMediaColorScheme } from './lib';
import { ColorScheme, Theme } from './types';

export const theme = createValueModel<Theme>('auto', {
  cache: {
    type: 'local',
    key: 'app-theme',
  },
});

const mediaColorScheme = createValueModel<ColorScheme>(getMediaColorScheme());

export const $colorScheme = combine(
  theme.$value,
  mediaColorScheme.$value,
  (theme, mediaColorScheme): ColorScheme =>
    theme === 'auto' ? mediaColorScheme : theme,
);

window
  .matchMedia?.('(prefers-color-scheme: dark)')
  ?.addEventListener('change', () => {
    mediaColorScheme.set(getMediaColorScheme());
  });
