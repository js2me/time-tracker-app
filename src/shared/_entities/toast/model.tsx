/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEvent } from 'effector';
import { toast as createToast } from 'sonner';
import { CreateToastPayload } from './types';

export const create = createEvent<CreateToastPayload>();

create.watch(({ message, type, ...config }) => {
  if (type) {
    createToast[type](message, config);
  } else {
    createToast.info(message, config);
  }
});
