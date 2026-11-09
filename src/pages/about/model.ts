import { RouteViewModel } from 'mobx-route/view-model';

import { routes } from '@/shared/lib/routes';

export class AboutPageVM extends RouteViewModel<typeof routes.about> {
  readonly route = routes.about;

  mount(): void {
    super.mount();

    document.title = 'О проекте';
  }
}
