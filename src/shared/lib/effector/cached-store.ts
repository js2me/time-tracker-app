import { createStore } from 'effector';
import {
  getFromStorage,
  setToStorage,
  StorageType,
} from '@/shared/lib/common/storage';

export interface CreateCachedStoreConfig {
  key: string;
  type: StorageType;
}

export const createCachedStore = <T>(
  initialValue: T,
  storageCfg: CreateCachedStoreConfig,
  storeCfg?: {
    updateFilter?: (update: T, current: T) => boolean;
    skipVoid?: boolean;
  },
) => {
  const key = `$store_${storageCfg.key}`;
  const stored = getFromStorage<T>({ type: storageCfg.type, key });
  const $store = createStore<T>(
    stored === null ? initialValue : stored,
    storeCfg,
  );

  $store.watch((value) => {
    setToStorage({ key, type: storageCfg.type, value });
  });

  return $store;
};
