import { Event, EventCallable, Store } from 'effector';
import { ComponentType } from 'react';

export type ModalViewProps<Payload = unknown> = {
  payload: Payload | null;
  open: boolean;
  onClose: VoidFunction;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyModalEvents = Record<string, EventCallable<any>>;

export interface ModalModel<Payload> {
  $existOnlyIf: Store<boolean>;
  $payload: Store<Payload | null>;
  $isOpened: Store<boolean>;
  close: EventCallable<void>;
  open: EventCallable<Payload>;
  closed: Event<void>;
  opened: Event<void>;
  reset: Event<void>;
}

export interface Modal<Payload = unknown> extends ModalModel<Payload> {
  id: string;
  view: ComponentType<ModalViewProps>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModalPayload<T extends ModalModel<any>> = T extends ModalModel<
  infer Payload
>
  ? Payload
  : never;

export interface ModalConfiguration<Payload> {
  view: ComponentType<ModalViewProps<Payload>>;
  existOnlyIf?: Store<boolean>;
}
