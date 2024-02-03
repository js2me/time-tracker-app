import { CircleFadingPlus } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { dataModel } from '@/entities/data';
import { toastModel } from '@/shared/_entities/toast';
import { ms } from '@/shared/lib/common/ms';
import { useToggle } from '@/shared/lib/react/hooks/use-toggle';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';

export const ManualAddLog = ({ className }: { className?: string }) => {
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
          variant={'outline'}
          size={'icon'}
          className={twMerge('shrink-0', className)}
        >
          <CircleFadingPlus className={'h-4 w-4'} />
        </Button>
      </DialogTrigger>
      <DialogContent className={'sm:max-w-[425px]'}>
        <DialogHeader>
          <DialogTitle>Ручное добавление лога</DialogTitle>
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

            console.info('fff', formData);

            const [hours, minutes] = formData.time.split(':');

            const spentTime = +hours * ms(1, 'hour') + +minutes * ms(1, 'min');

            const startDate = new Date(formData.date).toISOString();

            dataModel.addLogToActiveProject({
              startDate,
              spentTime,
              meta: formData.description || '',
            });
            form.reset();
            setVisible(false);
            toastModel.create({
              type: 'success',
              message: 'Лог добавлен!',
            });
          }}
        >
          <div className={'grid gap-4 py-4'}>
            <div className={'grid grid-cols-4 items-center gap-4'}>
              <Label htmlFor={'date'} className={'text-right'}>
                Дата
              </Label>
              <Input
                id={'date'}
                name={'date'}
                type={'date'}
                required
                className={'col-span-3'}
              />
            </div>
          </div>
          <div className={'grid gap-4 py-4'}>
            <div className={'grid grid-cols-4 items-center gap-4'}>
              <Label htmlFor={'time'} className={'text-right'}>
                Время
              </Label>
              <Input
                id={'time'}
                name={'time'}
                type={'time'}
                required
                className={'col-span-3'}
              />
            </div>
          </div>
          <div className={'grid gap-4 py-4'}>
            <div className={'grid grid-cols-4 items-center gap-4'}>
              <Label htmlFor={'description'} className={'text-right'}>
                Описание
              </Label>
            </div>
            <Textarea id={'description'} name={'description'} />
          </div>
          <DialogFooter>
            <Button type={'submit'}>Создать</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
