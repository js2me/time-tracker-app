import { EmptyObject } from 'atomic-router';
import { ViewModel } from '@/shared/lib/effector/view-model';
import type { BaseRouteCfg, RouteInstance } from './create-route';

export interface PathRouteInstance<Params extends AnyObject = EmptyObject>
  extends RouteInstance<Params> {
  path: string;
}

export interface PageRouteCfg extends BaseRouteCfg {
  type: 'page';
  path: string;
}

export function createPathRoute<Params extends EmptyObject = EmptyObject>(
  cfg: PageRouteCfg,
  instance: RouteInstance<EmptyObject>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  vm: ViewModel<AnyObject>,
): PathRouteInstance<Params> {
  const route = instance as unknown as PathRouteInstance<Params>;

  route.__.type = 'path';
  route.__.path = cfg.path;
  route.path = cfg.path;

  return route;
}

export const isPathRoute = (
  instance: AnyObject,
): instance is PathRouteInstance => instance?.__?.type === 'path';
