import { createEvent, sample } from 'effector';
import { once } from 'patronum';
import { routingModel } from '@/routing';
import { createViewModel } from '@/shared/lib/effector/view-model';

export const view = createViewModel();

export const loginButtonClicked = createEvent();

export const logoClicked = createEvent();

once(view.onMounted).watch(() => {
  sample({
    clock: logoClicked,
    target: routingModel.routes.home.navigate.prepend(() => ({
      replace: true,
      params: {},
      query: {},
    })),
  });
});
