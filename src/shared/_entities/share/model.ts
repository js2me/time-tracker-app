import { createEffect, createEvent, sample } from 'effector';

export const share = createEvent<ShareData>();

const shareFx = createEffect(async (data: ShareData) => {
  await navigator.share(data);
});

sample({
  clock: share,
  target: shareFx,
});
