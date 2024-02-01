import {
  combine,
  createEvent,
  EventCallable,
  EventPayload,
  sample,
} from 'effector';
import { condition, empty, not } from 'patronum';
import { LogRaw, Project, ProjectLog } from '@/entities/data';
import { appStartModel } from '@/shared/_entities/app-starter';
import { toastModel } from '@/shared/_entities/toast';
import { hammer } from '@/shared/lib/common/hammer';
import { ms } from '@/shared/lib/common/ms';
import { createTimerModel } from '@/shared/lib/effector/timer-model';
import { createValueModel } from '@/shared/lib/effector/value-model';

export const rate = createValueModel<number>(0, {
  cache: { type: 'local', key: 'rate' },
});

export const projects = createValueModel<Project>([], {
  type: 'list',
  cache: { type: 'local', key: 'projects' },
});

export const activeProject = createValueModel<Project | null>(null, {
  type: 'struct',
  cache: { type: 'local', key: 'active-project' },
});

export const activeLog = createValueModel<LogRaw | null>(null, {
  type: 'struct',
  cache: { type: 'local', key: 'active-log' },
});

const timer = createTimerModel({
  tickDelay: 1000,
  maxTicks: Infinity,
});

export const setActiveProject = activeProject.set as EventCallable<Project>;

export const $hasActiveLog = not(activeLog.$empty);

export const $activeLogIsActive = activeLog.$value.map(
  (log) => !!log && log.status === 'active',
);

export const $activeLogTime = activeLog.$value.map(
  (value) => value?.spentTime || 0,
);

export const createActiveLog = activeLog.set as EventCallable<LogRaw>;

export const addLogToActiveProject = createEvent<ProjectLog>();

export const finishActiveLog = createEvent();

export const pauseActiveLog = createEvent();

export const continueActiveLog = createEvent();

export const createNewProject = projects.add;

export const $logsLabels = combine(
  rate.$value,
  activeProject.$value,
  (rate, activeProject) => {
    if (!activeProject) return '';

    if (!activeProject.logs.length) return '';

    const segments = [] as string[];

    const totals = {
      hours: 0,
      minutes: 0,
    };

    activeProject.logs.forEach((log) => {
      const dur = hammer.parser.msDuration(log.spentTime);
      if (dur.hours || dur.minutes) {
        totals.hours += dur.hours;
        totals.minutes += dur.minutes;
        segments.push(`${dur.hours}h ${dur.minutes}m`);
      }
    });

    totals.hours += Math.floor(totals.minutes / 60);
    totals.minutes = Math.floor(totals.minutes % 60);

    return `${segments.join(' + ')} = ${totals.hours}h ${totals.minutes}m (${(
      rate * totals.hours +
      rate * (totals.minutes / 60)
    ).toFixed(2)} руб.)`;
  },
);

sample({
  clock: createNewProject,
  filter: empty(activeProject.$value),
  target: setActiveProject,
});

sample({
  clock: createActiveLog,
  filter: (log) => log.status === 'active',
  target: timer.start,
});

const activeLogFinished = sample({
  clock: sample({
    clock: finishActiveLog,
    source: [projects.$value, activeProject.$value, activeLog.$value] as const,
    fn: ([projects, activeProject, log]) =>
      log && activeProject && projects
        ? { log, activeProject, projects }
        : null,
  }),
  filter: Boolean,
});

const activeValidLogFinished =
  createEvent<EventPayload<typeof activeLogFinished>>();

condition({
  source: activeLogFinished,
  if: ({ log }) => log.spentTime <= ms(1, 'min'),
  then: toastModel.create.prepend(() => ({
    type: 'error',
    message: 'Слишком мало времени на один лог.',
    description: 'Нужно логировать как минимум 1 минуту',
  })),
  else: activeValidLogFinished,
});

sample({
  clock: activeValidLogFinished,
  filter: ({ activeProject, log }) => log.projectName === activeProject.name,
  target: activeProject.update.prepend(
    ({ activeProject, log }: EventPayload<typeof activeLogFinished>) => {
      return {
        logs: [
          ...(activeProject.logs || []),
          {
            startDate: log.startDate,
            spentTime: log.spentTime,
            meta: log.meta,
          },
        ],
      };
    },
  ),
});

sample({
  clock: activeValidLogFinished,
  filter: ({ activeProject, log }) => log.projectName !== activeProject.name,
  target: projects.set.prepend(
    ({ projects, log }: EventPayload<typeof activeLogFinished>) => {
      return projects.map((project) => {
        if (project.name === log.projectName) {
          return {
            ...project,
            logs: [
              ...(project.logs || []),
              {
                startDate: log.startDate,
                spentTime: log.spentTime,
                meta: log.meta,
              },
            ],
          };
        }

        return project;
      });
    },
  ),
});

sample({
  clock: activeLogFinished,
  target: [activeLog.reset, timer.stop],
});

sample({
  clock: sample({
    clock: pauseActiveLog,
    source: [activeProject.$value, activeLog.$value] as const,
    fn: ([project, log]) => (log && project ? { log, project } : null),
  }),
  filter: Boolean,
  target: [
    activeLog.update.prepend(() => ({
      status: 'paused',
      lastTickDate: Date.now(),
    })),
    timer.stop,
  ],
});

sample({
  clock: sample({
    clock: continueActiveLog,
    source: [activeProject.$value, activeLog.$value] as const,
    fn: ([project, log]) => (log && project ? { log, project } : null),
  }),
  filter: Boolean,
  target: [
    activeLog.update.prepend(() => ({
      status: 'active',
      lastTickDate: Date.now(),
    })),
    timer.start,
  ],
});

sample({
  clock: timer.tick,
  source: activeLog.$value,
  filter: Boolean,
  target: activeLog.update.prepend((log: LogRaw) => {
    const lastTickDate = log.lastTickDate;

    if (lastTickDate !== null && Date.now() - lastTickDate > ms(2, 'sec')) {
      return {
        spentTime: log.spentTime + (Date.now() - lastTickDate),
        lastTickDate: Date.now(),
      };
    }

    return {
      spentTime: log.spentTime + 1000,
      lastTickDate: Date.now(),
    };
  }),
});

activeLog.$value.watch((log) => {
  if (!log) {
    document.title = `Фриланс Тайм Машина`;
  } else if (log.status === 'active') {
    document.title = `Фрилансим (${hammer.format.dateTime(log.spentTime, {
      format: 'time',
      asTime: true,
    })})`;
  } else if (log.status === 'paused') {
    document.title = `Фриланс на паузе (${hammer.format.dateTime(
      log.spentTime,
      {
        format: 'time',
        asTime: true,
      },
    )})`;
  }
});

sample({
  clock: appStartModel.onAppStarted,
  source: activeLog.$value,
  filter: (log) => !!log && log.status === 'active',
  target: timer.start,
});

sample({
  clock: sample({
    clock: activeProject.$value,
    filter: Boolean,
  }),
  source: projects.$value,
  fn: (projects, activeProject) => {
    return projects.map((project) => {
      if (project.name === activeProject.name) {
        return { ...activeProject };
      }
      return project;
    });
  },
  target: projects.set,
});

sample({
  clock: sample({
    clock: addLogToActiveProject,
    source: activeProject.$value,
    fn: (project, log) => {
      if (!project) return null;

      return {
        ...project,
        logs: [...project.logs, log],
      };
    },
  }),
  filter: Boolean,
  target: activeProject.update,
});

export const copyDataToClipboard = createEvent();

sample({
  clock: copyDataToClipboard,
  source: $logsLabels,
});
