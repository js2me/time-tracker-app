import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-view-model';

import { Button } from '@/shared/ui/generated/button';
import { Input } from '@/shared/ui/generated/input';

import { ImportExportPageVM } from './model';

export const ImportExportPageView = observer(() => {
  const model = useViewModel<ImportExportPageVM>();

  return (
    <div className={'text-lg leading-6 flex flex-col gap-4'}>
      <Button onClick={model.handleExportClick}>Экспорт</Button>
      <div className={'flex-none w-full h-px bg-neutral-400'} />
      <div className={'flex flex-col gap-2'}>
        <Input
          type={'text'}
          required
          ref={model.importContentRef}
          className={'col-span-3'}
        />
        <Button onClick={model.handleImportClick}>Импорт</Button>
      </div>
    </div>
  );
});
