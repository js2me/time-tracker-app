import { useUnit } from 'effector-react';
import { Dialog } from '@/shared/ui/dialog';
import { Modal } from '../types';

export const DialogRenderer = ({ modal }: { modal: Modal }) => {
  const [existOnly, opened, close, payload] = useUnit([
    modal.$existOnlyIf,
    modal.$isOpened,
    modal.close,
    modal.$payload,
  ]);

  if (!existOnly) return null;

  const View = modal.view;

  return (
    <Dialog
      open={opened}
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      <View open={opened} onClose={close} payload={payload!} />
    </Dialog>
  );
};
