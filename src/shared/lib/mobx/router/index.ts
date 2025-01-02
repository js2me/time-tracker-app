/* eslint-disable sonarjs/no-nested-assignment */
import { MobxRouter as MobxRouterBase } from 'mobx-wouter';

export class MobxRouter extends MobxRouterBase {
  constructor() {
    super({
      location,
      history,
      type: 'hash',
      baseUrl: buildEnvs.BASE_URL || '/',
    });
  }
}
