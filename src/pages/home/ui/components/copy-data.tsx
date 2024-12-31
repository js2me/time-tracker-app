import { CopyIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';

import { Button } from '@/shared/ui/button';

import { HomePageVM } from '../../model';

export const CopyData = observer(() => {
  const { data } = useViewModel<HomePageVM>();

  return (
    <Button
      variant={'outline'}
      size={'icon'}
      className={'shrink-0'}
      disabled={!data.hasLogsLabels}
      onClick={data.copyDataToClipboard}
    >
      <CopyIcon className={'h-4 w-4'} />
    </Button>
  );
});
