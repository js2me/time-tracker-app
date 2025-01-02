import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import { HomePageVM } from '../../model';

export const ActiveProjectSelector = observer(() => {
  const model = useViewModel<HomePageVM>();

  return (
    <Select
      value={model.timeTracker.activeProject?.name}
      disabled={model.timeTracker.hasProjects}
      onValueChange={model.setActiveProject}
    >
      <SelectTrigger className={'max-w-[250px]'}>
        <SelectValue placeholder={'Выберите проект...'} />
      </SelectTrigger>
      <SelectContent>
        {model.timeTracker.projects.map((project) => {
          return (
            <SelectItem value={project.name || '-'} key={project.name}>
              {project.name || '-'}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
});
