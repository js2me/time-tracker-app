import { useStoreMap } from 'effector-react';
import { EraserIcon } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { dataModel } from '@/entities/data';
import { toastModel } from '@/shared/_entities/toast';
import { useToggle } from '@/shared/lib/react/hooks/use-toggle';
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

export const ResetTracking = () => {
  const [visible, , setVisible] = useToggle(false);
  const formRef = useRef<HTMLFormElement>(null);
  const disabled = useStoreMap(dataModel.$logsLabels, (labels) => !labels);

  useLayoutEffect(() => {
    if (!visible) {
      formRef.current?.reset();
    }
  }, [visible]);

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogTrigger asChild disabled={disabled}>
        <Button
          variant={'outline'}
          size={'icon'}
          className={'shrink-0'}
          disabled={disabled}
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

            dataModel.activeProject.update({
              logs: [],
            });

            form.reset();
            setVisible(false);
            toastModel.create({
              type: 'success',
              message: 'Всё сброшено!',
            });
          }}
        >
          <DialogFooter>
            <Button type={'submit'}>ОК</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
