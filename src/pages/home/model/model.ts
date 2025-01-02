import { action, autorun, computed, reaction, runInAction } from 'mobx';
import { PageViewModelImpl } from 'mobx-wouter';
import { formatDate } from 'yammies/date-time';
import { sanitizeHtml } from 'yammies/html';
import { ms } from 'yammies/ms';

import { LogRaw, Project, ProjectLog } from '@/entities/time-tracker/model';
import { Layout } from '@/pages/_layout';
import { rootStore } from '@/store';

interface LogGroup {
  label: string;
  logs: (ProjectLog & { index: number })[];
}

export class HomePageVM extends PageViewModelImpl {
  timeTracker = rootStore.entities.timeTracker;

  get hasActiveProject() {
    return true;
  }

  @computed
  get groupedLogs(): LogGroup[] | null {
    if (!this.timeTracker.activeProject) return null;

    if (this.timeTracker.activeProject.logs.length === 0) return [];

    const records: Record<string, LogGroup> = {};

    [...this.timeTracker.activeProject.logs]
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
  @action.bound
  setActiveProject(project: Project) {
    this.timeTracker.activeProject = project;
  }

  @action.bound
  addLogToActiveProject(log: ProjectLog) {
    if (!this.timeTracker.activeProject) return;

    this.timeTracker.activeProject.logs.push(log);

    rootStore.toasts.create({
      type: 'success',
      message: 'Лог добавлен!',
    });
  }

  @action.bound
  finishActiveLog() {
    if (
      !this.timeTracker.activeLog ||
      !this.timeTracker.activeProject ||
      !this.timeTracker.projects
    ) {
      return;
    }

    if (this.timeTracker.activeLog.spentTime <= ms(1, 'min')) {
      rootStore.toasts.create({
        type: 'error',
        message: 'Слишком мало времени на один лог.',
        description: 'Нужно логировать как минимум 1 минуту',
      });
      this.timeTracker.activeLog = null;
      this.timeTracker.ticker.reset();
      return;
    }

    let activeProject: Maybe<Project>;

    if (this.timeTracker.activeProject) {
      activeProject = this.timeTracker.activeProject;
    } else {
      activeProject = this.timeTracker.projects.find(
        (project) => project.name === this.timeTracker.activeLog?.projectName,
      );
    }

    if (activeProject) {
      activeProject.logs.push({
        startDate: this.timeTracker.activeLog.startDate,
        spentTime: this.timeTracker.activeLog.spentTime,
        meta: this.timeTracker.activeLog.meta,
      });
      rootStore.toasts.create({
        type: 'success',
        message: 'Хорошая работа!',
        description: `Лог добавлен в проект "${activeProject.name}"`,
      });
    }

    this.timeTracker.activeLog = null;
    this.timeTracker.ticker.reset();
  }

  @action.bound
  pauseActiveLog() {
    if (this.timeTracker.activeLog && this.timeTracker.activeProject) {
      this.timeTracker.activeLog.status = 'paused';
      this.timeTracker.activeLog.lastTickDate = Date.now();
      this.timeTracker.ticker.stop();
    }
  }

  @action.bound
  continueActiveLog() {
    if (this.timeTracker.activeLog && this.timeTracker.activeProject) {
      this.timeTracker.activeLog.status = 'active';
      this.timeTracker.activeLog.lastTickDate = Date.now();
      this.timeTracker.ticker.start();
    }
  }

  @action.bound
  createNewProject(project: Project) {
    this.timeTracker.projects.push({ ...project });
    this.timeTracker.activeProject = { ...project };

    rootStore.toasts.create({
      type: 'success',
      message: 'Проект успешно сделан!',
    });
  }

  @action.bound
  setRateForActiveProject(rate: number) {
    if (this.timeTracker.activeProject) {
      this.timeTracker.activeProject.rate = rate;
    }
  }

  @action.bound
  resetLogsForActiveProject() {
    if (this.timeTracker.activeProject) {
      this.timeTracker.activeProject.logs = [];
      rootStore.toasts.create({
        type: 'success',
        message: 'Всё сброшено!',
      });
    }
  }

  @action.bound
  createActiveLog(log: LogRaw) {
    this.timeTracker.activeLog = log;
    if (this.timeTracker.activeLog.status === 'active') {
      this.timeTracker.ticker.start();
    }
  }

  @action.bound
  udpateActiveLog(log: Partial<LogRaw>) {
    if (this.timeTracker.activeLog) {
      Object.assign(this.timeTracker.activeLog, log);
    }
  }

  @action.bound
  setLog(log: ProjectLog & { index: number }) {
    if (!this.timeTracker.activeProject) {
      return;
    }

    this.timeTracker.activeProject.logs[log.index] = { ...log };
  }

  @action.bound
  deleteLog(index: number) {
    if (!this.timeTracker.activeProject) {
      return;
    }

    this.timeTracker.activeProject.logs =
      this.timeTracker.activeProject.logs.filter(
        (_, logIndex) => logIndex !== index,
      );

    rootStore.toasts.create({
      type: 'success',
      message: 'Лог удалён!',
    });
  }

  copyDataToClipboard = () => {
    if (!this.timeTracker.activeProject) {
      return;
    }

    const textToClipboard = `
${this.timeTracker.logsLabels}

${this.timeTracker.activeProject.logs
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
    rootStore.toasts.create({
      message: 'Скопировано в буфер обмена',
    });
  };

  mount(): void {
    super.mount();

    autorun(
      () => {
        if (!this.timeTracker.activeLog) {
          document.title = `Фриланс Тайм Машина`;
        } else if (this.timeTracker.activeLog.status === 'active') {
          document.title = `${formatDate(this.timeTracker.activeLog.spentTime, {
            format: 'time',
            asTime: true,
          })} Фрилансим`;
        } else if (this.timeTracker.activeLog.status === 'paused') {
          document.title = `Фриланс на паузе (${formatDate(
            this.timeTracker.activeLog.spentTime,
            {
              format: 'time',
              asTime: true,
            },
          )})`;
        }
      },
      {
        signal: this.unmountSignal,
      },
    );

    reaction(
      () => this.timeTracker.isActiveLogActive,
      (isActiveLogActive) => {
        runInAction(() => {
          this.viewModels.get(Layout)!.isLogoAnimating = isActiveLogActive;
        });
      },
      {
        fireImmediately: true,
        signal: this.unmountSignal,
      },
    );
  }
}
