import { createEffect, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';

import { BrowserNotificationPayload } from './types';

const $browserNotificationsAllowed = createStore(
  'Notification' in window && Notification.permission === 'granted',
);

export const createBrowserNotification =
  createEvent<BrowserNotificationPayload>();
export const initBrowserNotifications = createEvent();

const initBrowserNotificationsFx = createEffect(async () => {
  if ('Notification' in window && Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      throw 'failed to init browser notifications';
    }
  }
});

const createBrowserNotificationFx = createEffect(
  (payload: BrowserNotificationPayload) => {
    new Notification(payload.title, {
      body: payload.body,
    });
  },
);

sample({
  clock: initBrowserNotifications,
  filter: not($browserNotificationsAllowed),
  target: initBrowserNotificationsFx,
});

sample({
  clock: initBrowserNotificationsFx.doneData,
  fn: () => true,
  target: $browserNotificationsAllowed,
});

sample({
  clock: createBrowserNotification,
  filter: $browserNotificationsAllowed,
  target: createBrowserNotificationFx,
});
