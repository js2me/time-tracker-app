import { useUnit } from 'effector-react';
import { dialogModel } from '@/shared/_entities/dialog';
import { DialogRenderer } from './dialog-renderer';

export const DialogsContainer = () => {
  const modals = useUnit(dialogModel.modals.$value);

  return (
    <>
      {modals.map((modal) => {
        return <DialogRenderer key={modal.id} modal={modal} />;
      })}
    </>
  );
};
