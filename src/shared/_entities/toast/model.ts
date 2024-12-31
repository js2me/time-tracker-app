import { toast as createToast } from 'sonner';

import { CreateToastPayload } from './model.types';

export class ToastStore {
  create({ message, type, ...config }: CreateToastPayload) {
    if (type) {
      createToast[type](message, config);
    } else {
      createToast.info(message, config);
    }
  }
}
