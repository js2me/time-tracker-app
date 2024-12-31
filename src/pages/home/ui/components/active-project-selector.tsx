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
  const { data } = useViewModel<HomePageVM>();

  return (
    <Select
      value={data.activeProject?.name}
      disabled={data.projects.length === 0}
      onValueChange={(name) =>
        data.setActiveProject(
          data.projects.find((project) => project.name === name)!,
        )
      }
    >
      <SelectTrigger className={'max-w-[250px]'}>
        <SelectValue placeholder={'Выберите проект...'} />
      </SelectTrigger>
      <SelectContent>
        {data.projects.map((project) => {
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
