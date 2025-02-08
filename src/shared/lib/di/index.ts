import { container, tag } from 'mobidic';
import { TwoColorThemeStore } from 'mobx-shared-entities/theme';
import {
  viewModelsConfig,
  ViewModelStore,
  ViewModelStoreBase,
} from 'mobx-view-model';
import { IMobxRouter, MobxRouter } from 'mobx-wouter';

import { ToastStore } from '@/shared/_entities/toast';

import { ThemeStoreImpl } from '../mobx/theme';

viewModelsConfig.factory = (config) => container.inject(config.VM, config);
viewModelsConfig.onUnmount = (vm) => container.destroy(vm);

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
  scope: 'resolution',
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
      new ViewModelStoreBase({
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
  abortSignal: tag({
    scope: 'resolution',
    value: () => container.inject(AbortController).signal,
  }),
} as const;

console.info(container);

export * from 'mobidic';
