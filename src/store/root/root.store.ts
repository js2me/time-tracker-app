import { TwoColorThemeStore } from 'mobx-shared-entities/theme';
import { ViewModelStore } from 'mobx-vm-entities';

import { TimeTrackerModel } from '@/entities/time-tracker/model';
import { ToastStore } from '@/shared/_entities/toast';
import { MobxRouter } from '@/shared/lib/mobx/router';

/**
 * Рут стор приложения
 */
export interface AppRootStore {
  /**
   * Роутер приложения
   */
  router: MobxRouter;
  /**
   * Тема приложения
   */
  theme: TwoColorThemeStore;
  /**
   * Модель для работы со вьюшками
   */
  viewModels: ViewModelStore;

  toasts: ToastStore;

  entities: {
    timeTracker: TimeTrackerModel;
  };
}

declare global {
  interface RootStore extends AppRootStore {}
}
