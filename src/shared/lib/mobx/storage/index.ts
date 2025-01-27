import { container } from 'mobidic';
import {
  StorageModel as StorageModelBase,
  StorageType,
} from 'mobx-shared-entities/storage';

import { storageKeyPrefix } from '@/shared/config/storage';

export class StorageModel extends StorageModelBase {
  protected abortController = container.inject(AbortController);

  constructor(type?: StorageType) {
    super({
      prefix: storageKeyPrefix,
      type: type ?? 'local',
    });
  }
}
