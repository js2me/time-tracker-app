import { reaction } from 'mobx';
import { PageViewModelImpl } from 'mobx-wouter';
import { formatDate } from 'yammies/date-time';

import { DataModel } from '@/entities/data-new';
import { rootStore } from '@/shared/store';

export class HomePageVM extends PageViewModelImpl {
  data = new DataModel(rootStore, this.unmountSignal);

  get hasActiveProject() {
    return true;
  }

  mount(): void {
    super.mount();

    reaction(
      () => this.data.activeLog,
      (log) => {
        if (!log) {
          document.title = `Фриланс Тайм Машина`;
        } else if (log.status === 'active') {
          document.title = `${formatDate(log.spentTime, {
            format: 'time',
            asTime: true,
          })} Фрилансим`;
        } else if (log.status === 'paused') {
          document.title = `Фриланс на паузе (${formatDate(log.spentTime, {
            format: 'time',
            asTime: true,
          })})`;
        }
      },
      {
        fireImmediately: true,
        signal: this.unmountSignal,
      },
    );
  }
}
