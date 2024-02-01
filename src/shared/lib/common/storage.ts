import { storageKeyPrefix } from '@/shared/config/storage';

export type StorageType = 'session' | 'local';

const storages: Record<StorageType, Storage> = {
  session: sessionStorage,
  local: localStorage,
};

const processStorageKey = (key: string) => `${storageKeyPrefix}/${key}`;

const parseStorageValue = <V>(value: unknown): V | null => {
  if (typeof value !== 'string') {
    return value as V;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (e) {
    return value as V;
  }
};

const formatValueToStorage = (value: unknown): string => {
  if (typeof value === 'object' || value == null) {
    return JSON.stringify(value);
  }

  return `${value}`;
};

export const setToStorage = (cfg: {
  key: string;
  value: unknown;
  type: StorageType;
}) => {
  const storage = storages[cfg.type];

  storage.setItem(processStorageKey(cfg.key), formatValueToStorage(cfg.value));
};

export const getFromStorage = <V>(cfg: { key: string; type: StorageType }) => {
  const storage = storages[cfg.type];

  return parseStorageValue<V>(storage.getItem(processStorageKey(cfg.key)));
};
