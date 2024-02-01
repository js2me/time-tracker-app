import { createEffect } from 'effector';

export const copyFx = createEffect(async (text: string) => {
  await navigator.clipboard.writeText(text);
});
