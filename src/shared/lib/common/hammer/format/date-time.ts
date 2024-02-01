import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { typeGuard } from '@/shared/lib/common/type-guard';
import { NO_VALUE } from './constants';
import { parseSetting } from './utils';

import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.locale('ru');

const toLibFormat = function (
  value: Maybe<string | number | Dayjs>,
  asTime?: boolean,
): Dayjs | undefined {
  if (typeGuard.isNumber(value)) {
    if (asTime) {
      return dayjs.duration(value) as unknown as Dayjs;
    }
    return dayjs(value);
  } else if (typeGuard.isString(value)) {
    return dayjs(value);
  } else if (dayjs.isDayjs(value)) {
    return value;
  }
};

export const dateTime = function (
  value: Maybe<string | number | Dayjs>,
  settings?: Maybe<{
    format?:
      | 'human'
      | 'full'
      | 'short'
      | 'day'
      | 'day-only'
      | 'month'
      | 'spent-time'
      | 'time'
      | string;
    pattern?: string;
    asTime?: boolean;
  }>,
) {
  const dateFormat = parseSetting(settings, 'format', 'full');
  const datePattern = parseSetting(settings, 'pattern');
  const asTime = !!parseSetting(settings, 'asTime');

  value = toLibFormat(value, asTime);

  if (typeGuard.isUndefined(value)) {
    return NO_VALUE;
  }

  if (datePattern) {
    return value.format(datePattern);
  }

  switch (dateFormat) {
    case 'human':
      return value.fromNow();
    case 'spent-time':
      return value.fromNow(true);
    case 'full':
      return value.format('DD MMM YYYY HH:mm:ss');
    case 'short':
      return value.format('DD MMM HH:mm');
    case 'time':
      return value.format('HH:mm:ss');
    case 'day':
      return value.format('DD MMM YYYY');
    case 'month':
      return value.format('MMMM YYYY');
    default:
      return value.format(dateFormat);
  }
};
