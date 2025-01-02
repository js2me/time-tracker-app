import { EraserIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';
import { useLayoutEffect, useRef } from 'react';
import { useToggle } from 'react-shared-utils/hooks';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

import { HomePageVM } from '../../model';

export const ResetTracking = observer(() => {
  const { timeTracker: data } = useViewModel<HomePageVM>();
  const [visible, , setVisible] = useToggle(false);
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    if (!visible) {
      formRef.current?.reset();
    }
  }, [visible]);

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogTrigger asChild disabled={!data.hasLogsLabels}>
        <Button
          variant={'outline'}
          size={'icon'}
          className={'shrink-0'}
          disabled={!data.hasLogsLabels}
        >
          <EraserIcon className={'h-4 w-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent className={'sm:max-w-[425px]'}>
        <DialogHeader>
          <DialogTitle>Сброс данных по трекингу</DialogTitle>
          <DialogDescription>
            Все логи по текущему проекту будут удалены
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const form = formRef.current!;

            data.resetLogsForActiveProject();

            form.reset();
            setVisible(false);
          }}
        >
          <DialogFooter>
            <Button type={'submit'}>ОК</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
