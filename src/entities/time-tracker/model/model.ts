import { clamp } from 'lodash-es';
import { container } from 'mobidic';
import { injectable } from 'mobidic/decorators';
import { action, computed, observable, reaction } from 'mobx';
import { Ticker } from 'mobx-shared-entities/ticker';
import { timeDuration } from 'yummies/date-time';
import { ms } from 'yummies/ms';

import { StorageModel } from '@/shared/lib/mobx/storage';

import { LogRaw, Project } from './model.types';

@injectable({ scope: 'singleton' })
export class TimeTrackerModel {
  private abortSignal = container.inject(AbortController).signal;
  private storage = container.inject(StorageModel);

  ticker: Ticker = container.inject(Ticker, {
    ticksPer: ms(1, 'sec'),
    abortSignal: this.abortSignal,
  });

  @observable
  accessor projects: Project[] = [];

  @observable
  accessor activeProject: Project | null = null;

  @observable
  accessor activeLog: LogRaw | null = null;

  constructor() {
    this.storage.syncProperty(this, 'projects', { key: '$store_projects' });
    this.storage.syncProperty(this, 'activeProject', {
      key: '$store_active-project',
    });
    this.storage.syncProperty(this, 'activeLog', { key: '$store_active-log' });

    if (this.activeLog?.status === 'active') {
      this.ticker.start();
    }
    reaction(() => this.ticker.ticks, this.handleTick, {
      signal: this.abortSignal,
    });
    reaction(
      () => JSON.stringify(this.activeProject),
      this.handleActiveProjectChanged,
      { signal: this.abortSignal },
    );
  }

  @computed
  get hasProjects() {
    return this.projects.length > 0;
  }

  get hasActiveLog() {
    return this.activeLog != null;
  }

  get hasActiveProject() {
    return this.activeProject != null;
  }

  get activeProjectName() {
    return this.activeProject?.name ?? '';
  }

  get isActiveLogActive() {
    return this.activeLog?.status === 'active';
  }

  get activeLogTime() {
    return this.activeLog?.spentTime ?? 0;
  }

  logMinTime = ms(1, 'min');

  @computed
  get activeLogTimeWithMinLimit() {
    return clamp(this.activeLogTime, 0, this.logMinTime);
  }

  get logsLabels() {
    if (!this.activeProject) return '';

    if (this.activeProject.logs.length === 0) return '';

    const segments = [] as string[];

    const totals = {
      hours: 0,
      minutes: 0,
    };

    this.activeProject.logs.forEach((log) => {
      const dur = timeDuration(log.spentTime);

      if (dur.hours || dur.minutes) {
        totals.hours += dur.hours;
        totals.minutes += dur.minutes;
        segments.push(
          [dur.hours && `${dur.hours}h`, dur.minutes && `${dur.minutes}m`]
            .filter(Boolean)
            .join(' '),
        );
      }
    });

    totals.hours += Math.floor(totals.minutes / 60);
    totals.minutes = Math.floor(totals.minutes % 60);

    return `${segments.join(' + ')} = ${totals.hours}h ${totals.minutes}m (${(
      this.activeProject.rate * totals.hours +
      this.activeProject.rate * (totals.minutes / 60)
    ).toFixed(2)} руб.)`;
  }

  @computed
  get hasLogsLabels() {
    return !!this.logsLabels;
  }

  @action
  private handleTick = () => {
    if (this.activeLog) {
      const lastTickDate = this.activeLog.lastTickDate;

      if (lastTickDate !== null && Date.now() - lastTickDate > ms(1.5, 'sec')) {
        this.activeLog.spentTime =
          this.activeLog.spentTime + (Date.now() - lastTickDate);
      } else {
        this.activeLog.spentTime = this.activeLog.spentTime + ms(1, 'sec');
      }

      this.activeLog.lastTickDate = Date.now();
    }
  };

  @action
  private handleActiveProjectChanged = () => {
    if (!this.activeProject) return;

    for (const project of this.projects) {
      if (project.name === this.activeProject.name) {
        Object.assign(project, this.activeProject);
        return;
      }
    }
  };
} 