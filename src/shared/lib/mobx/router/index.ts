import { MobxRouter as MobxRouterBase, RouterToConfig } from 'mobx-wouter';

export class MobxRouter extends MobxRouterBase {
  routerType: 'hash' | 'browser' = 'hash';

  baseUrl = buildEnvs.BASE_URL || '/';

  createUrl(to: RouterToConfig): string {
    let builtUrl = super.createUrl(to);

    if (this.routerType === 'hash') {
      builtUrl = `#${builtUrl}`;
    }

    if (this.baseUrl && this.baseUrl !== '/') {
      builtUrl = `${this.baseUrl}${builtUrl}`;
    }

    return builtUrl;
  }
}
