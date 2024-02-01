import { EmptyObject, NavigateParams, RouteQuery } from 'atomic-router';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  Effect,
  Event,
  EventCallable,
  sample,
  Store,
  StoreWritable,
} from 'effector';
import { and, empty, not } from 'patronum';
import { createValueModel } from '@/shared/lib/effector/value-model';
import { ViewModel } from '@/shared/lib/effector/view-model';
import { when } from '@/shared/lib/effector/when';
import type { Router } from '../create-router';
import type { BaseRouteCfg, RouteInstance } from './create-route';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const sheetModel: any;

export interface ModalRouteInstance<Params extends AnyObject = EmptyObject>
  extends Omit<
    RouteInstance<Params>,
    '$query' | 'opened' | 'navigate' | 'open' | '$params'
  > {
  close: EventCallable<void>;
  open: EventCallable<Params>;
  opened: Event<Params>;
  $params: Store<NonNullable<Params> | null>;
  navigate: Effect<
    Omit<NavigateParams<Params>, 'query'>,
    Omit<NavigateParams<Params>, 'query'>
  >;
}

export interface ModalRouteCfg<Params extends AnyObject = EmptyObject>
  extends BaseRouteCfg {
  type: 'modal';
  name: string;
  params?: (query: AnyObject) => null | Params;
}

const checkModalActive = (name: string, query: RouteQuery) =>
  query.modal === name;

export function createModalRoute<Params extends EmptyObject = EmptyObject>(
  cfg: ModalRouteCfg,
  instance: RouteInstance<Params>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  vm: ViewModel<AnyObject>,
): ModalRouteInstance<Params> {
  instance.__.type = 'modal';
  const route = instance as unknown as ModalRouteInstance<Params>;

  const sheet = sheetModel.register({
    view: instance.__.Component,
  });

  const connected = createValueModel(false, { type: 'switch' });

  const paramsParser = cfg.params == null ? () => ({}) : cfg.params;

  route.$isOpened = createStore(false);

  route.$params = createStore<NonNullable<Params> | null>(null);

  route.close = createEvent();

  route.closed = createEvent();
  route.opened = createEvent<Params>();

  route.navigate = createEffect<
    Omit<NavigateParams<Params>, 'query'>,
    Omit<NavigateParams<Params>, 'query'>
  >();

  sample({
    clock: route.open,
    fn: (params) => ({ params, replace: false }),
    target: route.navigate,
  });

  sample({
    clock: when(route.$isOpened),
    filter: not(sheet.$isOpened),
    target: sheet.open,
  });

  sample({
    clock: when(not(route.$isOpened)),
    filter: sheet.$isOpened,
    target: sheet.close,
  });

  sample({
    clock: when(and(not(sheet.$isOpened), not(route.$isOpened))),
    target: route.closed,
  });

  sample({
    clock: when(and(sheet.$isOpened, route.$isOpened)),
    source: route.$params,
    filter: Boolean,
    target: route.opened as EventCallable<Params>,
  });

  sample({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    clock: sheet.close,
    target: route.close,
  });

  sample({
    clock: when(empty(route.$params)),
    target: route.close,
  });

  const connectRouter = (router: Router) => {
    sample({
      clock: and(router.$query.map(checkModalActive.bind(null, cfg.name))),
      target: route.$isOpened as StoreWritable<boolean>,
    });

    sample({
      clock: combine(router.$query, connected.$value).map(
        ([query]): NonNullable<Params> | null => {
          if (!checkModalActive(cfg.name, query)) return null;
          return (paramsParser(query) as NonNullable<Params>) ?? null;
        },
      ),
      target: route.$params as StoreWritable<NonNullable<Params> | null>,
    });

    sample({
      clock: route.close,
      target: router.updateQueryParams.prepend(() => ({
        data: { modal: '' },
        method: 'replace',
      })),
    });

    sample({
      source: route.navigate,
      target: router.updateQueryParams.prepend(
        ({ params, method }: AnyObject) => ({
          data: { ...params, modal: cfg.name },
          method,
        }),
      ),
    });

    connected.turnOn();
  };

  route.__.connectRouter = connectRouter;

  return route;
}

export const isModalRoute = (
  instance: AnyObject,
): instance is ModalRouteInstance => instance?.__?.type === 'modal';
