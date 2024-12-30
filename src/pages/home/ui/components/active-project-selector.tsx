import { useUnit } from 'effector-react/compat';

import { dataModel } from '@/entities/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export const ActiveProjectSelector = () => {
  const projects = useUnit(dataModel.projects);
  const activeProject = useUnit(dataModel.activeProject);

  const setActiveProject = useUnit(dataModel.setActiveProject);

  return (
    <Select
      value={activeProject.value?.name}
      disabled={projects.empty}
      onValueChange={(name) =>
        setActiveProject(
          projects.value.find((project) => project.name === name)!,
        )
      }
    >
      <SelectTrigger className={'max-w-[250px]'}>
        <SelectValue placeholder={'Выберите проект...'} />
      </SelectTrigger>
      <SelectContent>
        {projects.value.map((project) => {
          return (
            <SelectItem value={project.name || '-'} key={project.name}>
              {project.name || '-'}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
