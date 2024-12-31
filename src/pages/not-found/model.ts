import { PageViewModelImpl } from 'mobx-wouter';

import { rootStore } from '@/shared/store';

export class NotFoundPageVM extends PageViewModelImpl {
  mount(): void {
    rootStore.router.navigate('/', { replace: true });
  }
}
