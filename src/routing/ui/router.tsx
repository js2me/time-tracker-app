import { Route, RouterProvider } from 'atomic-router-react';
import { memo, ReactNode } from 'react';

import { routingLib, routingModel } from '@/routing';
import { createRoute } from '../lib';

export const Router = memo(({ children }: { children?: ReactNode }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <RouterProvider router={routingModel.router as any}>
      {createRoute.routes.map((route) => {
        if (routingLib.isModalRoute(route)) return null;

        return (
          <Route key={route.__.id} route={route} view={route.__.Component} />
        );
      })}
      {children}
    </RouterProvider>
  );
});
