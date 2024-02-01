import { useLayoutEffect } from 'react';
import { ViewModelInternal } from '@/shared/lib/effector/view-model';

export const connectHook = <Events extends AnyObject>(
  vm: ViewModelInternal<Events>,
) => {
  return () => {
    useLayoutEffect(() => {
      vm.setMounted(true);
      return () => {
        vm.setMounted(false);
      };
    }, []);
  };
};
