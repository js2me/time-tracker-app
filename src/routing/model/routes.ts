import { createRoute } from '../lib';

/**
 * Домашняя страница
 */
export const home = createRoute({
  type: 'page',
  path: '',
  view: async () => (await import('@/pages/home')).HomePage,
});
