import { observable } from 'mobx';
import { ViewModelImpl } from 'mobx-vm-entities';

export class LayoutVM extends ViewModelImpl {
  @observable.ref
  accessor isLogoAnimating = false;

  handleClickLogo = () => {
    //
  };
}
