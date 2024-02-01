import { createRouter } from '../lib';

export const router = createRouter({
  base: buildEnvs.BASE_URL || '/',

  privacy: () => {
    // TODO:
  },
});
