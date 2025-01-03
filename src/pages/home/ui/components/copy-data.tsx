import { CopyIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';

import { Button } from '@/shared/ui/generated/button';

import { HomePageVM } from '../../model';

export const CopyData = observer(() => {
  const model = useViewModel<HomePageVM>();

  return (
    <Button
      variant={'outline'}
      size={'icon'}
      className={'shrink-0'}
      disabled={!model.timeTracker.hasLogsLabels}
      onClick={model.copyDataToClipboard}
    >
      <CopyIcon className={'h-4 w-4'} />
    </Button>
  );
});
