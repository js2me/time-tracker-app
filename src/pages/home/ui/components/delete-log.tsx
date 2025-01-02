import { Trash } from 'lucide-react';
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

export const DeleteLog = observer(
  ({ index, onDelete }: { index: number; onDelete: VoidFunction }) => {
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

              model.deleteLog(index);
              form.reset();
              onDelete();
              setVisible(false);
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
  },
);
