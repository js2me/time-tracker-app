import { withLazyPageViewModel } from 'mobx-wouter';

export const AboutPage = withLazyPageViewModel(async () => {
  const [{ AboutPageVM }, { AboutPageView }] = await Promise.all([
    import('./model'),
    import('./view'),
  ]);

  return {
    Model: AboutPageVM,
    View: AboutPageView,
  };
});
