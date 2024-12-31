import { computed, reaction, runInAction } from 'mobx';
import { PageViewModelImpl } from 'mobx-wouter';
import { formatDate } from 'yammies/date-time';

import { DataModel, ProjectLog } from '@/entities/data';
import { Layout } from '@/pages/_layout';
import { rootStore } from '@/shared/store';

interface LogGroup {
  label: string;
  logs: (ProjectLog & { index: number })[];
}

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

    reaction(
      () => this.data.isActiveLogActive,
      (isActiveLogActive) => {
        runInAction(() => {
          this.viewModels.get(Layout)!.isLogoAnimating = isActiveLogActive;
        });
      },
      {
        fireImmediately: true,
      },
    );
  }

  @computed
  get groupedLogs(): LogGroup[] | null {
    if (!this.data.activeProject) return null;

    if (this.data.activeProject.logs.length === 0) return [];

    const records: Record<string, LogGroup> = {};

    [...this.data.activeProject.logs]
      .map((log, index) => ({ ...log, index }))
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
      .forEach((log) => {
        const dateLabel = formatDate(log.startDate, {
          format: 'month',
        });

        if (!records[dateLabel]) {
          records[dateLabel] = { label: dateLabel, logs: [] };
        }

        records[dateLabel].logs.push(log);
      });

    return Object.values(records);
  }
}