import { container } from 'mobidic';
import { PageViewModelBase } from 'mobx-wouter';
import { createRef } from 'yummies/mobx';

import { TimeTrackerModel } from '@/entities/time-tracker/model';
import { tags } from '@/shared/lib/di';

export class ImportExportPageVM extends PageViewModelBase {
  private timeTracker = container.inject(TimeTrackerModel);
  private router = container.inject(tags.router);
  private toasts = container.inject(tags.toaster);

  importContentRef = createRef<HTMLInputElement>();

  handleExportClick = () => {
    navigator.clipboard.writeText(JSON.stringify(this.timeTracker.export()));

    this.toasts.create({
      type: 'success',
      message: 'Скопировано в буффер!',
    });
  };

  handleImportClick = () => {
    if (!this.importContentRef.current) {
      return;
    }

    try {
      const data = JSON.parse(this.importContentRef.current.value);

      if (!data?.projects) {
        return;
      }

      this.timeTracker.import(data);

      this.toasts.create({
        type: 'success',
        message: 'Импортировано!',
      });
    } catch {
      /* empty block */
    }
  };

  mount(): void {
    super.mount();

    document.title = 'Импорт/экспорт';
  }
}
