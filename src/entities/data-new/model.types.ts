export interface Project {
  name: string;
  logs: ProjectLog[];
  rate: number;
}

export interface ProjectLog {
  startDate: string;
  spentTime: number;
  meta: string;
  dash?: boolean;
}

export interface LogRaw {
  projectName: string;
  startDate: string;
  spentTime: number;
  lastTickDate: number | null;
  meta: string;
  status: 'active' | 'paused';
}
