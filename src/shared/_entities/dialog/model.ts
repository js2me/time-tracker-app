import { createEvent, createStore, sample } from 'effector';
import { generateId } from '@/shared/lib/common/id';
import { always } from '@/shared/lib/effector/always';
import { createValueModel } from '@/shared/lib/effector/value-model';
import { Modal, ModalConfiguration, ModalModel } from './types';

export const modals = createValueModel<Modal>([], {
  type: 'list',
});

export const register = <Payload>({
  view,
  existOnlyIf,
}: ModalConfiguration<Payload>): ModalModel<Payload> => {
  const id = generateId();

  const openSwitch = createValueModel(false, { type: 'switch' });

  const open = createEvent<Payload>();

  const reset = createEvent();

  const $payload = createStore<Payload | null>(null);
  const $existOnlyIf = existOnlyIf || always(true);

  sample({
    clock: open,
    fn: (payload) => (payload == null ? null : payload),
    target: [$payload, openSwitch.turnOn],
  });

  sample({
    clock: reset,
    target: [openSwitch.reset, $payload.reinit],
  });

  const model: ModalModel<Payload> = {
    $existOnlyIf,
    $isOpened: openSwitch.$on,
    $payload,
    open,
    reset,
    close: openSwitch.turnOff,
    closed: openSwitch.turnedOff,
    opened: openSwitch.turnedOn,
  };

  const modal: Modal<Payload> = {
    ...model,
    view: view as Modal['view'],
    id,
  };

  modals.add(modal as Modal);

  return model;
};
