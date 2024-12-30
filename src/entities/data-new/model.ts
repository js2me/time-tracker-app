import { action, observable, reaction } from 'mobx';
import { Ticker } from 'mobx-shared-entities/ticker';
import { ms } from 'yammies/ms';

import { storageSync } from '@/shared/lib/mobx/decorators/storage-sync';

import { LogRaw, Project, ProjectLog } from './model.types';

export class DataModel {
  private ticker = new Ticker({
    ticksPer: ms(1, 'min'),
    abortSignal: this.abortSignal,
  });

  @storageSync({ type: 'local', key: 'rate', fallback: 0 })
  @observable
  accessor rate!: number;

  @storageSync({ type: 'local', key: 'projects', fallback: [] })
  @observable
  accessor projects!: Project[];

  @storageSync({ type: 'local', key: 'active-project', fallback: null })
  @observable
  accessor activeProject!: Project | null;

  @storageSync({ type: 'local', key: 'active-log', fallback: null })
  @observable
  accessor activeLog!: LogRaw | null;

  constructor(
    private rootStore: RootStore,
    private abortSignal?: AbortSignal,
  ) {
    reaction(() => this.ticker.ticks, this.handleTick);
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

  @action.bound
  addLogToActiveProject(log: ProjectLog) {
    if (!this.activeProject) return;
    this.activeProject.logs.push(log);
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
    } else if (this.activeLog.projectName === this.activeProject.name) {
      this.activeProject.logs.push({
        startDate: this.activeLog.startDate,
        spentTime: this.activeLog.spentTime,
        meta: this.activeLog.meta,
      });
      this.rootStore.toasts.create({
        type: 'success',
        message: 'Хорошая работа!',
        description: `Лог добавлен в проект "${this.activeProject.name}"`,
      });
      this.activeLog = null;
      this.ticker.reset();
    } else {
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
    this.projects.push(project);
    this.activeProject = project;
  }

  @action.bound
  createActiveLog(log: LogRaw) {
    this.activeLog = log;
    if (this.activeLog.status === 'active') {
      this.ticker.start();
    }
  }

  @action.bound
  changeLog(log: ProjectLog & { index: number }) {
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
  }

  copyDataToClipboard() {
    if (this)
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
}
