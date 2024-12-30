import { PlusIcon } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { useToggle } from 'react-shared-utils/hooks';

import { dataModel } from '@/entities/data';
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
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import { toastModel } from '@/shared/_entities/toast';

export const AddProject = () => {
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
        <Button variant={'outline'} size={'icon'} className={'shrink-0'}>
          <PlusIcon className={'h-4 w-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent className={'sm:max-w-[425px]'}>
        <DialogHeader>
          <DialogTitle>Создание проекта</DialogTitle>
          <DialogDescription>Создавай давай</DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const form = formRef.current!;
            const formData = Object.fromEntries(
              new FormData(form),
            ) as AnyObject;

            dataModel.createNewProject({
              logs: [],
              rate: 0,
              name: formData.name,
            });
            form.reset();
            setVisible(false);
            toastModel.create({
              type: 'success',
              message: 'Проект успешно сделан!',
            });
          }}
        >
          <div className={'grid gap-4 py-4'}>
            <div className={'grid grid-cols-4 items-center gap-4'}>
              <Label htmlFor={'name'} className={'text-right'}>
                Имя
              </Label>
              <Input
                id={'name'}
                name={'name'}
                required
                className={'col-span-3'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type={'submit'}>Создать</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
