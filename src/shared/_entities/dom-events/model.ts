/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  createEvent,
  createStore,
  Event as EventEffector,
  EventCallable,
  Store,
} from 'effector';
import { debounce } from 'lodash-es';

interface ElementEvent<
  K extends keyof UnpackEventListenersMap<Element>,
  Element extends HTMLElement | Window = Window,
> {
  /**
   * Состояние - слушатель включен\выключен
   */
  $enabled: Store<boolean>;
  /**
   * Слушатель, который будет вызван, когда событие вызовется
   */
  handler: EventEffector<UnpackEventListenersMap<Element>[K]>;
  /**
   * Остановить слушателя
   */
  disable: EventCallable<unknown>;
  /**
   * Запустить слушателя
   */
  enable: EventCallable<unknown>;
}

interface CreateElementEventCfg<
  K extends keyof UnpackEventListenersMap<Element>,
  Element extends HTMLElement | Window,
> {
  event: K;
  element: Element;
  options?: Parameters<Element['addEventListener']>[2];
  timeout?: number;
}

type UnpackEventListenersMap<T extends AnyObject> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : T extends HTMLBodyElement
      ? HTMLBodyElementEventMap
      : HTMLElementEventMap;

export const createElementEvent = <
  K extends keyof UnpackEventListenersMap<Element>,
  Element extends HTMLElement | Window,
>({
  event: eventName,
  element,
  timeout,
  options,
}: CreateElementEventCfg<K, Element>): ElementEvent<K, Element> => {
  const $enabled = createStore(false);

  const enable = createEvent<unknown>();
  const disable = createEvent<unknown>();

  $enabled.on(enable, () => true).on(disable, () => false);

  const handleEvent = createEvent<UnpackEventListenersMap<Element>[K]>();
  const realHandler =
    timeout == null ? handleEvent : debounce(handleEvent, timeout);

  $enabled.watch((enabled) => {
    if (enabled) {
      // @ts-expect-error
      element.addEventListener(eventName, realHandler, options);
    } else {
      // @ts-expect-error
      element.removeEventListener(eventName, realHandler, options);
    }
  });

  return {
    $enabled,
    enable,
    disable,
    handler: handleEvent,
  };
};
