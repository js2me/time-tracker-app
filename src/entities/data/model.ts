import { action, computed, observable, reaction } from 'mobx';
import { Ticker } from 'mobx-shared-entities/ticker';
import { formatDate, timeDuration } from 'yammies/date-time';
import { sanitizeHtml } from 'yammies/html';
import { ms } from 'yammies/ms';

import { StorageModel } from '@/shared/lib/mobx/storage';

import { LogRaw, Project, ProjectLog } from './model.types';

export class DataModel {
  private storage: StorageModel;
  private ticker: Ticker;

  @observable
  accessor projects: Project[] = [];

  @observable
  accessor activeProject: Project | null = null;

  @observable
  accessor activeLog: LogRaw | null = null;

  constructor(
    private rootStore: RootStore,
    private abortSignal?: AbortSignal,
  ) {
    this.storage = new StorageModel();
    this.ticker = new Ticker({
      ticksPer: ms(1, 'sec'),
      abortSignal: this.abortSignal,
    });

    this.storage.syncProperty(this, 'projects', { key: '$store_projects'});
    this.storage.syncProperty(this, 'activeProject', { key: '$store_active-project' });
    this.storage.syncProperty(this, 'activeLog', { key: '$store_active-log' });

    if (this.activeLog?.status === 'active') {
      this.ticker.start();
    }
    reaction(() => this.ticker.ticks, this.handleTick);
    reaction(() => this.activeProject, this.handleActiveProjectChanged);
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

  @computed
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

  @action.bound
  setActiveProject(project: Project) {
    this.activeProject = project;
  }

  @action.bound
  addLogToActiveProject(log: ProjectLog) {
    if (!this.activeProject) return;

    this.activeProject.logs.push(log);

    this.rootStore.toasts.create({
      type: 'success',
      message: 'Лог добавлен!',
    });
  }

  @action.bound
  finishActiveLog() {
    if (!this.activeLog || !this.activeProject || !this.projects) {
      return;
    }

    if (this.activeLog.spentTime <= ms(1, 'min')) {
      this.rootStore.toasts.create({
        type: 'error',
        message: 'Слишком мало времени на один лог.',
        description: 'Нужно логировать как минимум 1 минуту',
      });
      this.activeLog = null;
      this.ticker.reset();
      return;
    }

    const projectByActiveLog = this.projects.find(
      (project) => project.name === this.activeLog?.projectName,
    );

    if (projectByActiveLog) {
      projectByActiveLog.logs.push({
        startDate: this.activeLog.startDate,
        spentTime: this.activeLog.spentTime,
        meta: this.activeLog.meta,
      });
      this.rootStore.toasts.create({
        type: 'success',
        message: 'Хорошая работа!',
        description: `Лог добавлен в проект "${projectByActiveLog.name}"`,
      });
    }

    this.activeLog = null;
    this.ticker.reset();
  }

  @action.bound
  pauseActiveLog() {
    if (this.activeLog && this.activeProject) {
      this.activeLog.status = 'paused';
      this.activeLog.lastTickDate = Date.now();
      this.ticker.stop();
    }
  }

  @action.bound
  continueActiveLog() {
    if (this.activeLog && this.activeProject) {
      this.activeLog.status = 'active';
      this.activeLog.lastTickDate = Date.now();
      this.ticker.start();
    }
  }

  @action.bound
  createNewProject(project: Project) {
    this.projects.push({ ...project });
    this.activeProject = { ...project };

    this.rootStore.toasts.create({
      type: 'success',
      message: 'Проект успешно сделан!',
    });
  }

  @action.bound
  setRateForActiveProject(rate: number) {
    if (this.activeProject) {
      this.activeProject.rate = rate;
    }
  }

  @action.bound
  resetLogsForActiveProject() {
    if (this.activeProject) {
      this.activeProject.logs = [];
      this.rootStore.toasts.create({
        type: 'success',
        message: 'Всё сброшено!',
      });
    }
  }

  @action.bound
  createActiveLog(log: LogRaw) {
    this.activeLog = log;
    if (this.activeLog.status === 'active') {
      this.ticker.start();
    }
  }

  @action.bound
  udpateActiveLog(log: Partial<LogRaw>) {
    if (this.activeLog) {
      Object.assign(this.activeLog, log);
    }
  }

  @action.bound
  setLog(log: ProjectLog & { index: number }) {
    if (!this.activeProject) {
      return;
    }

    this.activeProject.logs[log.index] = { ...log };
  }

  @action.bound
  deleteLog(index: number) {
    if (!this.activeProject) {
      return;
    }

    this.activeProject.logs = this.activeProject.logs.filter(
      (_, logIndex) => logIndex !== index,
    );

    this.rootStore.toasts.create({
      type: 'success',
      message: 'Лог удалён!',
    });
  }

  copyDataToClipboard = () => {
    if (!this.activeProject) {
      return;
    }

    const textToClipboard = `
${this.logsLabels}

${this.activeProject.logs
  .map((log) => {
    const doc = new DOMParser().parseFromString(
      sanitizeHtml(log.meta),
      'text/html',
    );
    const meta = doc.body.textContent ?? '';

    return `${formatDate(log.startDate, {
      format: 'full',
    })} - ${formatDate(log.spentTime, {
      format: 'time-short',
      asTime: true,
    })} - ${meta}`;
  })
  .join('\n')}
`;

    navigator.clipboard.writeText(textToClipboard);
    this.rootStore.toasts.create({
      message: 'Скопировано в буфер обмена',
    });
  };

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
  private handleActiveProjectChanged = (projectUpdate: Maybe<Project>) => {
    if (!projectUpdate) return;

    for (const project of this.projects) {
      if (project.name === projectUpdate.name) {
        Object.assign(project, projectUpdate);
        return;
      }
    }
  };
}
