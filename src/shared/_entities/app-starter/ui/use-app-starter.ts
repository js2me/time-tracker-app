import { useLayoutEffect } from 'react';
import { appStartModel } from '@/shared/_entities/app-starter';

export const useAppStarter = () => {
  useLayoutEffect(() => {
    appStartModel.appStartCalled.turnOn();
  }, []);
};
