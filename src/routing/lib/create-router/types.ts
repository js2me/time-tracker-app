import {
  createRouterControls,
  HistoryPushParams,
  RouteObject,
  RouteQuery,
} from 'atomic-router';
import { Effect, Event, EventCallable, Store } from 'effector';
import { History } from 'history';
import { RouteInstance } from '../create-route';

export interface Router {
  $path: Store<string>;
  $activeRoutes: Store<RouteInstance<AnyObject>[]>;
  $history: Store<History>;
  setHistory: EventCallable<History>;
  $query: Store<RouteQuery>;
  back: EventCallable<void>;
  forward: EventCallable<void>;
  push: Effect<Omit<HistoryPushParams, 'history'>, HistoryPushParams, Error>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes: RouteObject<any>[];
  initialized: Event<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeRoutes: RouteInstance<any>[];
    path: string;
    query: RouteQuery;
  }>;
  routeNotFound: Event<void>;
  controls: ReturnType<typeof createRouterControls>;

  updateQueryParams: EventCallable<{
    method?: 'replace' | 'push';
    data: AnyObject;
  }>;
}
