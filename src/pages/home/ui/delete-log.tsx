import { useUnit } from 'effector-react';
import { Trash } from 'lucide-react';
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

export const DeleteLog = ({
  index,
  onDelete,
}: {
  index: number;
  onDelete: VoidFunction;
}) => {
  const [visible, , setVisible] = useToggle(false);
  const [deleteLog] = useUnit([dataModel.deleteLog]);
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    if (!visible) {
      formRef.current?.reset();
    }
  }, [visible]);

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogTrigger asChild>
        <Button
          className={'mt-auto h-5 w-5'}
          size={'icon'}
          variant={'destructive'}
        >
          <Trash className={'h-3 w-3'} />
        </Button>
      </DialogTrigger>
      <DialogContent className={'sm:max-w-[425px]'}>
        <DialogHeader>
          <DialogTitle>Удаление лога</DialogTitle>
          <DialogDescription>Нужно подтвердить удаление</DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const form = formRef.current!;

            deleteLog({ index });
            form.reset();
            onDelete();
            setVisible(false);
            toastModel.create({
              type: 'success',
              message: 'Лог удалён!',
            });
          }}
        >
          <DialogFooter>
            <Button type={'submit'} variant={'destructive'}>
              УДАЛИТЬ
            </Button>
            <Button
              type={'button'}
              variant={'ghost'}
              onClick={() => {
                setVisible(false);
              }}
            >
              НЕ НАДО
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
