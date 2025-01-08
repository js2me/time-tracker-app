import { TwoColorThemeStore } from 'mobx-shared-entities/theme';
import {
  AnyViewModel,
  ViewModelStore,
  ViewModelStoreImpl,
} from 'mobx-vm-entities';
import { IMobxRouter, MobxRouter } from 'mobx-wouter';

import { TimeTrackerModel } from '@/entities/time-tracker/model';
import { ToastStore } from '@/shared/_entities/toast';
import { ThemeStoreImpl } from '@/shared/lib/mobx/theme';

export class RootStoreImpl implements RootStore {
  router: IMobxRouter;
  theme: TwoColorThemeStore;
  viewModels: ViewModelStore<AnyViewModel>;
  toasts: ToastStore;
  entities: { timeTracker: TimeTrackerModel };

  constructor() {
    this.theme = new ThemeStoreImpl();
    this.toasts = new ToastStore();
    this.viewModels = new ViewModelStoreImpl();
    this.router = new MobxRouter({
      type: 'hash',
      baseUrl: buildEnvs.BASE_URL || '/',
      useStartViewTransition: true,
    });
    this.entities = {
      timeTracker: new TimeTrackerModel({
        rootStore: this,
      }),
    };
  }
}
