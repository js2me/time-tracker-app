import { useUnit } from 'effector-react';
import { CopyIcon } from 'lucide-react';
import { dataModel } from '@/entities/data';
import { Button } from '@/shared/ui/button';

export const CopyData = () => {
  const handleClick = useUnit(dataModel.copyDataToClipboard);

  return (
    <Button
      variant={'outline'}
      size={'icon'}
      className={'shrink-0'}
      onClick={handleClick}
    >
      <CopyIcon className={'h-4 w-4'} />
    </Button>
  );
};
