import { container, tag } from 'mobidic';
import { TwoColorThemeStore } from 'mobx-shared-entities/theme';
import { ViewModelStore, ViewModelStoreImpl } from 'mobx-vm-entities';
import { IMobxRouter, MobxRouter } from 'mobx-wouter';

import { ToastStore } from '@/shared/_entities/toast';

import { ThemeStoreImpl } from '../mobx/theme';

container.configure({
  fallbackTag: (value) => {
    return {
      token: value,
      scope: 'container',
    };
  },
});

tag({
  token: AbortController,
  scope: 'container',
  destroy: (abortController) => {
    abortController.abort();
  },
});

export const tags = {
  /**
   * Тема приложения
   */
  theme: tag<TwoColorThemeStore>({
    scope: 'singleton',
    value: () => new ThemeStoreImpl(),
  }),
  /**
   * Модель для работы со вьюшками
   */
  viewModels: tag<ViewModelStore>({
    value: () =>
      new ViewModelStoreImpl({
        vmConfig: {
          factory: (config) => container.inject(config.VM, config),
        },
      }),
    scope: 'singleton',
  }),
  toaster: tag<ToastStore>({
    value: () => new ToastStore(),
    scope: 'singleton',
  }),
  /**
   * Роутер приложения
   */
  router: tag<IMobxRouter>({
    scope: 'singleton',
    value: () =>
      new MobxRouter({
        type: 'hash',
        baseUrl: buildEnvs.BASE_URL || '/',
        useStartViewTransition: true,
      }),
  }),
} as const;

export * from 'mobidic';
