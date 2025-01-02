import { TwoColorThemeStore } from 'mobx-shared-entities/theme';
import {
  AnyViewModel,
  ViewModelStore,
  ViewModelStoreImpl,
} from 'mobx-vm-entities';

import { TimeTrackerModel } from '@/entities/time-tracker/model';
import { ToastStore } from '@/shared/_entities/toast';
import { MobxRouter } from '@/shared/lib/mobx/router';
import { ThemeStoreImpl } from '@/shared/lib/mobx/theme';

export class RootStoreImpl implements RootStore {
  router: MobxRouter;
  theme: TwoColorThemeStore;
  viewModels: ViewModelStore<AnyViewModel>;
  toasts: ToastStore;
  entities: { timeTracker: TimeTrackerModel };

  constructor() {
    this.theme = new ThemeStoreImpl();
    this.toasts = new ToastStore();
    this.viewModels = new ViewModelStoreImpl();
    this.router = new MobxRouter({});
    this.entities = {
      timeTracker: new TimeTrackerModel({
        rootStore: this,
      }),
    };
  }
}
