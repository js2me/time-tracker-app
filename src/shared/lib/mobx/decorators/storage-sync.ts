import { createStorageSyncDecorator } from 'storage-sync-accessor-decorator';

import { GetFromStorageConfig, storage } from '@/shared/lib/common/storage';

interface StorageSyncDecoratorConfig<T>
  extends Omit<GetFromStorageConfig<T>, 'key' | 'prefix'> {
  /**
   * Ключ хранилища, если не указан, то будет использовано имя свойства
   */
  key?: GetFromStorageConfig<T>['key'];
}

export const storageSync = createStorageSyncDecorator<
  StorageSyncDecoratorConfig<any>
>({
  get: storage.get,
  set: storage.set,
});
