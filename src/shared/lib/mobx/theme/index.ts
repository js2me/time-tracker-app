import { reaction } from 'mobx';
import {
  TwoColorThemeStoreConfig,
  TwoColorThemeStoreImpl,
} from 'mobx-shared-entities/theme';

export class ThemeStoreImpl extends TwoColorThemeStoreImpl {
  constructor(config?: TwoColorThemeStoreConfig) {
    super(config);

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
