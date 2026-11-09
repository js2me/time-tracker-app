import { createRoute } from 'mobx-route';

export const routes = {
  home: createRoute('/', { hash: true, exact: true }),
  about: createRoute('/about', { hash: true, exact: true }),
  importExport: createRoute('/import-export', { hash: true, exact: true }),
};
