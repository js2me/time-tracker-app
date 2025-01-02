import { PageViewModelImpl } from 'mobx-wouter';

export class AboutPageVM extends PageViewModelImpl {
  mount(): void {
    super.mount();

    document.title = 'О проекте';
  }
}
