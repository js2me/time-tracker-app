import { container } from 'mobidic';
import { ViewModelBase } from 'mobx-view-model';

import { TimeTrackerModel } from '@/entities/time-tracker/model';
import { routes } from '@/shared/lib/routes';

export class LayoutVM extends ViewModelBase {
  private timeTracker = container.inject(TimeTrackerModel);

  get isLogoAnimating() {
    return this.timeTracker.isActiveLogActive;
  }

  handleClickLogo = () => {
    routes.home.open();
  };
}
