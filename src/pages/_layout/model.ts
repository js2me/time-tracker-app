import { container } from 'mobidic';
import { ViewModelImpl } from 'mobx-vm-entities';

import { TimeTrackerModel } from '@/entities/time-tracker/model';
import { tags } from '@/shared/lib/di';

export class LayoutVM extends ViewModelImpl {
  private timeTracker = container.inject(TimeTrackerModel);
  private router = container.inject(tags.router);

  get isLogoAnimating() {
    return this.timeTracker.isActiveLogActive;
  }

  handleClickLogo = () => {
    this.router.navigate('/');
  };
}
