/* eslint-disable sonarjs/duplicates-in-character-class */
import { Save, SquarePen, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useViewModel } from 'mobx-vm-entities';
import { useLayoutEffect, useState } from 'react';
import { useToggle } from 'react-shared-utils/hooks';
import { formatDate, timeDuration } from 'yammies/date-time';
import { sanitizeHtml } from 'yammies/html';
import { ms } from 'yammies/ms';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

import { HomePageVM } from '../../model';

import { DeleteLog } from './delete-log';
import { ProjectLog } from '../../model/data';

function wrapLinks(text: string) {
  const linkRegex = /(https?:\/\/[-a-zA-Z0-9@:%._\\+~#?&//=]*)/g;

  return text.replaceAll(linkRegex, (match) => {
    return `<a href="${match}" target="_blank" rel="nofollow" class="text-link">${match}</a>`;
  });
}

const prepareMeta = (meta: string) => {
  return wrapLinks(sanitizeHtml(meta));
};

export const Log = observer(
  ({ log, index }: { log: ProjectLog; index: number }) => {
    const { data } = useViewModel<HomePageVM>();

    const [editMode, toggleEditMode, setEditMode] = useToggle(false);
    const [meta, setMeta] = useState(log.meta);
    const [time, setTime] = useState(() => {
      const dur = timeDuration(log.spentTime);
      return {
        hours: dur.hours,
        minutes: dur.minutes,
      };
    });

    useLayoutEffect(() => {
      if (!editMode) {
        const dur = timeDuration(log.spentTime);
        setMeta(log.meta);
        setTime({
          hours: dur.hours,
          minutes: dur.minutes,
        });
      }
    }, [log, editMode]);

    return (
      <div
        className={'group relative my-1 select-text'}
        data-active={editMode || undefined}
      >
        <div
          className={`absolute left-0 top-0 h-full w-1 select-text rounded-sm ${
            editMode ? 'bg-reverse/70' : 'bg-accent'
          }`}
        />
        <span className={'ml-3 select-text text-sm text-foreground/70'}>
          {formatDate(log.startDate, {
            pattern: 'dddd, D, HH:mm A',
          })}
        </span>
        <span
          className={`ml-1 inline-flex select-text text-sm text-foreground/70 ${
            editMode ? 'mb-1.5' : ''
          }`}
        >
          {editMode ? (
            <Input
              size={'sm'}
              type={'time'}
              className={'h-6.5 px-1.5 font-semibold text-foreground'}
              value={`${time.hours.toString().padStart(2, '0')}:${time.minutes
                .toString()
                .padStart(2, '0')}`}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                setTime({ hours: +hours || 0, minutes: +minutes || 0 });
              }}
            />
          ) : (
            <span className={'select-text font-semibold text-foreground'}>
              {formatDate(log.spentTime, {
                format: 'time-short',
                asTime: true,
              })}
            </span>
          )}
        </span>
        {editMode ? (
          <Textarea
            className={'ml-3'}
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
          />
        ) : (
          <div
            className={'ml-3 select-text whitespace-pre-wrap'}
            dangerouslySetInnerHTML={{
              __html: prepareMeta(meta),
            }}
          />
        )}
        <div
          className={
            'absolute -left-6 top-0 flex flex-col gap-2 opacity-10 group-hover:opacity-100 group-data-[active]:opacity-100'
          }
        >
          {editMode ? (
            <>
              <Button
                size={'icon'}
                variant={'ghost'}
                className={'h-5 w-5'}
                onClick={toggleEditMode}
              >
                <X className={'h-3 w-3'} />
              </Button>
              <Button
                size={'icon'}
                variant={'positive'}
                className={'mb-4 h-5 w-5'}
                onClick={() => {
                  data.setLog({
                    ...log,
                    meta,
                    index,
                    spentTime:
                      time.hours * ms(1, 'hour') + time.minutes * ms(1, 'min'),
                  });
                  toggleEditMode();
                }}
              >
                <Save className={'h-3 w-3'} />
              </Button>
              <DeleteLog index={index} onDelete={() => setEditMode(false)} />
            </>
          ) : (
            <Button
              size={'icon'}
              variant={'ghost'}
              className={'h-5 w-5'}
              onClick={toggleEditMode}
            >
              <SquarePen className={'h-3 w-3'} />
            </Button>
          )}
        </div>
      </div>
    );
  },
);
