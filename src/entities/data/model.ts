import { combine, createEvent, sample } from 'effector';

import { LogRaw, Project, ProjectLog } from '@/entities/data';
import { toastModel } from '@/shared/_entities/toast';

import { appStartModel } from '@/shared/_entities/app-starter';
import { clipboardModel } from '@/shared/_entities/clipboard';
import { hammer } from '@/shared/lib/common/hammer';
import { sanitizeHtml } from '@/shared/lib/common/html';
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

export const changeLog = createEvent<ProjectLog & { index: number }>();
export const deleteLog = createEvent<{ index: number }>();

export const $logsLabels = combine(activeProject.$value, (activeProject) => {
  if (!activeProject) return '';

  if (activeProject.logs.length === 0) return '';

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
