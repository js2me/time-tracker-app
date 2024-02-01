/* eslint-disable react-hooks/rules-of-hooks */
import { ComponentType } from 'react';
import { connectHook } from './connect-hook';
import type { ViewModelInternal } from './types';

export const connectHOC = <Events extends AnyObject>(
  vm: ViewModelInternal<Events>,
) => {
  return <P extends AnyObject>(
    Component: ComponentType<P>,
  ): ComponentType<P> => {
    const useConnect = connectHook(vm);
    function connectedVMComponent(props: P) {
      useConnect();
      return <Component {...props} />;
    }

    connectedVMComponent.displayName = `connectedVMComponent(${Component.displayName})`;

    return connectedVMComponent;
  };
};
