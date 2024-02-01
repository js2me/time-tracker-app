import {
  createRoute as createAtomicRoute,
  EmptyObject,
  RouteInstance as AtomicRouteInstance,
} from 'atomic-router';
import { ComponentType } from 'react';
import { generateId } from '@/shared/lib/common/id';
import { createViewModel, ViewModel } from '@/shared/lib/effector/view-model';
import { loadable } from '@/shared/lib/react/loadable';
import { ModalRouteLoader, PageRouteLoader } from '../../ui';
import {
  createModalRoute,
  ModalRouteCfg,
  ModalRouteInstance,
} from './create-modal-route';
import {
  createPathRoute,
  PageRouteCfg,
  PathRouteInstance,
} from './create-path-route';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncViewLoader = () => Promise<ComponentType<any>>;

export interface RouteInstance<Params extends AnyObject = EmptyObject>
  extends AtomicRouteInstance<Params> {
  view: ViewModel<AnyObject>;

  __: AnyObject;
  /*
  {
    loader: AsyncViewLoader;
    Component: AnyComponentType;
    id: string;
    path: string;
    $paramsParser: Store<(query: AnyObject) => null | Params>;
  };
   */
}

export interface BaseRouteCfg {
  view: AsyncViewLoader;
  /**
   * Приветный роут или нет (реализация приватности описаывается через роутер)
   */
  private?: boolean;
}

export function createRoute<Params extends AnyObject = EmptyObject>(
  cfg: ModalRouteCfg<Params>,
): ModalRouteInstance<Params>;

export function createRoute<Params extends AnyObject = EmptyObject>(
  cfg: PageRouteCfg,
): PathRouteInstance<Params>;

export function createRoute(cfg: AnyObject): AnyObject {
  const instance = createAtomicRoute() as RouteInstance<EmptyObject>;
  const vm = createViewModel({
    /**
     * так сделано потому что состояние $isOpened модалок напрямую зависит от отображения sheet модального окна
     */
    route: cfg.type === 'modal' ? undefined : instance,
  });

  instance.view = vm;

  if (!instance.__) {
    (instance as AnyObject).__ = {};
  }

  instance.__.id = generateId();
  instance.__.loader = cfg.view;
  instance.__.private = cfg.private;
  instance.__.Component = loadable(
    cfg.view,
    cfg.type === 'modal' ? ModalRouteLoader : PageRouteLoader,
    vm.connect(() => null),
  );

  if (cfg.type === 'page') {
    const route = createPathRoute(cfg as PageRouteCfg, instance, vm);
    createRoute.routes.push(route as unknown as RouteInstance<AnyObject>);
    return route;
  }
  if (cfg.type === 'modal') {
    const route = createModalRoute(cfg as ModalRouteCfg, instance, vm);
    createRoute.routes.push(route as unknown as RouteInstance<AnyObject>);
    return route;
  }

  throw new Error('unknown route configuration');
}

createRoute.routes = [] as RouteInstance<AnyObject>[];
