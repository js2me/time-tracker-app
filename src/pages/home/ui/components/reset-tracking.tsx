import { EraserIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-view-model';
import { useLayoutEffect, useRef } from 'react';
import { useToggle } from 'react-shared-utils/hooks';

import { Button } from '@/shared/ui/generated/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/generated/dialog';

import { HomePageVM } from '../../model';

export const ResetTracking = observer(() => {
  const model = useViewModel<HomePageVM>();
  const [visible, , setVisible] = useToggle(false);
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    if (!visible) {
      formRef.current?.reset();
    }
  }, [visible]);

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogTrigger asChild disabled={!model.timeTracker.hasLogsLabels}>
        <Button
          variant={'outline'}
          size={'icon'}
          className={'shrink-0'}
          disabled={!model.timeTracker.hasLogsLabels}
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

            model.resetLogsForActiveProject();

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
