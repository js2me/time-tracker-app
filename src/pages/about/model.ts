import { PageViewModelBase } from 'mobx-wouter/page-view-model';

export class AboutPageVM extends PageViewModelBase {
  mount(): void {
    super.mount();

    document.title = 'О проекте';
  }
}
