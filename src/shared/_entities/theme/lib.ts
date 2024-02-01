import { ColorScheme } from './types';

export const getMediaColorScheme = (): ColorScheme => {
  if (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
    return 'dark';
  }

  return 'light';
};
