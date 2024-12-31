import { reaction } from 'mobx';
import { TwoColorThemeStore } from 'mobx-shared-entities/theme';

export class ThemeStoreImpl extends TwoColorThemeStore {
  constructor() {
    super({
      localStorageKey: 'theme',
    });

    reaction(
      () => this.colorScheme,
      (colorScheme) => {
        if (colorScheme === 'light') {
          document.body.classList.remove('dark');
          document.body.classList.add('light');
        } else {
          document.body.classList.remove('light');
          document.body.classList.add('dark');
        }
      },
      {
        fireImmediately: true,
        signal: this.abortSignal,
      },
    );
  }
}
