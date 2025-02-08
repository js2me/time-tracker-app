import { PageViewModelBase } from 'mobx-wouter';

export class AboutPageVM extends PageViewModelBase {
  mount(): void {
    super.mount();

    document.title = 'О проекте';
  }
}
