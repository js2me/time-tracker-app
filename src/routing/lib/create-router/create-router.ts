import { createHistoryRouter, createRouterControls } from 'atomic-router';
import { createEvent, sample } from 'effector';
import {
  createRoute,
  isModalRoute,
  isPathRoute,
  RouteInstance,
} from '../create-route';
import { Router } from './types';

export const createRouter = (cfg: {
  base: string;
  privacy?: (route: RouteInstance<AnyObject>, router: Router) => void;
}) => {
  const controls = createRouterControls();

  const router = createHistoryRouter({
    base: cfg.base.endsWith('/')
      ? cfg.base.substring(0, cfg.base.length - 1)
      : cfg.base,
    routes: createRoute.routes.filter(isPathRoute).map((instance) => ({
      route: instance,
      path: instance.__.path,
    })),
    controls,
  }) as unknown as Router;

  const updateQueryParams = createEvent<{
    method?: 'replace' | 'push';
    data: AnyObject;
  }>();

  sample({
    source: [router.$query, router.$path, router.$activeRoutes] as const,
    clock: updateQueryParams,
    fn: ([query, path, activeRoutes], { method, data: queryUpdate }) => {
      return {
        activeRoute: activeRoutes[0],
        method: method || 'push',
        path,
        query: Object.fromEntries(
          Object.entries({
            ...query,
            ...queryUpdate,
          }).filter((entry) => entry[1] != null && entry[1] != ''),
        ),
      };
    },
  }).watch(({ activeRoute, method, query }) => {
    if (!activeRoute) return;

    const params = activeRoute.$params.getState();

    activeRoute.navigate({
      params,
      query,
      replace: method === 'replace',
    });
  });

  const customRouter = {
    ...router,
    controls,
    updateQueryParams,
  };

  createRoute.routes.forEach((route) => {
    if (isModalRoute(route)) {
      route.__.connectRouter(customRouter);
    }
    if (cfg.privacy && route.__.private) {
      cfg.privacy(route, customRouter);
    }
  });

  return customRouter;
};
