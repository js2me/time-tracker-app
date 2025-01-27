import { container } from 'mobidic';
import { PageViewModelImpl } from 'mobx-wouter';

import { tags } from '@/shared/lib/di';

export class NotFoundPageVM extends PageViewModelImpl {
  private router = container.inject(tags.router);

  mount(): void {
    this.router.navigate('/', { replace: true });
  }
}
