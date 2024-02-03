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
import { clipboardModel } from '@/shared/_entities/clipboard';
import { toastModel } from '@/shared/_entities/toast';
import { hammer } from '@/shared/lib/common/hammer';
import { sanitizeHtml } from '@/shared/lib/common/html';
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

export const $hasActiveProject = not(activeProject.$empty);

export const $activeProjectName = activeProject.$value.map(
  (project) => project?.name || '',
);

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

export const changeLog = createEvent<ProjectLog & { index: number }>();
export const deleteLog = createEvent<{ index: number }>();

export const $logsLabels = combine(activeProject.$value, (activeProject) => {
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
    activeProject.rate * totals.hours +
    activeProject.rate * (totals.minutes / 60)
  ).toFixed(2)} руб.)`;
});

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
  clock: activeValidLogFinished,
  target: toastModel.create.prepend(
    ({ activeProject }: { activeProject: Project }) => ({
      type: 'success',
      message: 'Хорошая работа!',
      description: `Лог добавлен в проект "${activeProject.name}"`,
    }),
  ),
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

    if (lastTickDate !== null && Date.now() - lastTickDate > ms(1.5, 'sec')) {
      return {
        spentTime: log.spentTime + (Date.now() - lastTickDate),
        lastTickDate: Date.now(),
      };
    }

    return {
      spentTime: log.spentTime + ms(1, 'sec'),
      lastTickDate: Date.now(),
    };
  }),
});

activeLog.$value.watch((log) => {
  if (!log) {
    document.title = `Фриланс Тайм Машина`;
  } else if (log.status === 'active') {
    document.title = `${hammer.format.dateTime(log.spentTime, {
      format: 'time',
      asTime: true,
    })} Фрилансим`;
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
  clock: sample({
    clock: copyDataToClipboard,
    source: [$logsLabels, activeProject.$value] as const,
    fn: ([logLabels, project]) => {
      if (!project) return null;

      return `
${logLabels}

${project.logs
  .map((log) => {
    const doc = new DOMParser().parseFromString(
      sanitizeHtml(log.meta),
      'text/html',
    );
    const meta = doc.body.textContent || '';

    return `${hammer.format.dateTime(log.startDate, {
      format: 'full',
    })} - ${hammer.format.dateTime(log.spentTime, {
      format: 'time-short',
      asTime: true,
    })} - ${meta}`;
  })
  .join('\n')}
`;
    },
  }),
  filter: Boolean,
  target: [
    clipboardModel.copyFx,
    toastModel.create.prepend(() => ({
      message: 'Скопировано',
    })),
  ],
});

sample({
  clock: sample({
    clock: changeLog,
    source: activeProject.$value,
    fn: (project, { index: indexToUpdate, ...log }) => {
      if (!project) return null;

      return {
        ...project,
        logs: project.logs.map((data, i) => {
          if (i === indexToUpdate) return { ...log };

          return data;
        }),
      };
    },
  }),
  filter: Boolean,
  target: activeProject.set,
});

sample({
  clock: sample({
    clock: deleteLog,
    source: activeProject.$value,
    fn: (project, { index: indexToDelete }) => {
      if (!project) return null;

      return {
        ...project,
        logs: project.logs.filter((_, i) => i !== indexToDelete),
      };
    },
  }),
  filter: Boolean,
  target: activeProject.set,
});
