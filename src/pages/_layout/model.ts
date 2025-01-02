import { ViewModelImpl } from 'mobx-vm-entities';

import { rootStore } from '@/store';

export class LayoutVM extends ViewModelImpl {
  get isLogoAnimating() {
    return rootStore.entities.timeTracker.isActiveLogActive;
  }

  handleClickLogo = () => {
    rootStore.router.navigate('/');
  };
}
