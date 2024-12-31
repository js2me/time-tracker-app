/* eslint-disable import/order */
import '@/app/styles/globals.css';

import { createRoot } from 'react-dom/client';
import { rootElement } from '@/shared/config/dom';

import { App } from '@/app';
import { ViewModelsProvider } from 'mobx-vm-entities';
import { rootStore } from './shared/store';
import { RootStoreProvider } from './shared/lib/mobx/root-store';

createRoot(rootElement).render(
  <RootStoreProvider value={rootStore}>
    <ViewModelsProvider value={rootStore.viewModels}>
      <App />
    </ViewModelsProvider>
  </RootStoreProvider>,
);
