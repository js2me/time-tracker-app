import { sample } from 'effector';
import { not } from 'patronum';
import { routingModel } from '@/routing';
import { appStartModel } from '@/shared/_entities/app-starter';

appStartModel.blockIf(not(routingModel.$initialized));

sample({
  clock: appStartModel.onAppStart,
  target: [routingModel.initialize],
});
