import dateLib, { Dayjs as LibDateType } from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import utc from 'dayjs/plugin/utc';
import { ms } from '@/shared/lib/common/ms';
import 'dayjs/locale/ru.js';
import { declension } from '@/shared/lib/common/text';

export const enum DateLibLocaleName {
  Ru = 'ru',
  En = 'en',
  Pl = 'pl',
}

// const DATE_LOCALE_IMPORTS: Record<DateLibLocaleName, () => Promise<unknown>> = {
//   [DateLibLocaleName.En]: () => import('dayjs/locale/en.js'),
//   [DateLibLocaleName.Ru]: () => import('dayjs/locale/ru.js'),
//   [DateLibLocaleName.Pl]: () => import('dayjs/locale/pl.js'),
// };

// dateLib.extend(utc);
dateLib.extend(relativeTime);
dateLib.extend(updateLocale);
dateLib.extend(calendar);
// dateLib.extend(customParseFormat);

dateLib.locale(DateLibLocaleName.Ru);

dateLib.updateLocale(DateLibLocaleName.Ru, {
  relativeTime: {
    future: 'через %s',
    past: '%s назад',
    s: 'несколько секунд',
    m: 'минута',
    mm: (count: number) =>
      `${count} ${declension(count, ['минута', 'минуты', 'минут'])}`,
    h: 'час',
    hh: (count: number) =>
      `${count} ${declension(count, ['час', 'часа', 'часов'])}`,
    d: 'день',
    dd: (count: number) =>
      `${count} ${declension(count, ['день', 'дня', 'дней'])}`,
    M: 'месяц',
    MM: (count: number) =>
      `${count} ${declension(count, ['месяц', 'месяца', 'месяцев'])}`,
    y: 'год',
    yy: (count: number) =>
      `${count} ${declension(count, ['год', 'года', 'лет'])}`,
  },
});

export const enum DateFormat {
  Date = 'DD.MM.YYYY',
  DateTimeShort = 'DD.MM.YY HH:mm',
  DateTimeFull = 'DD.MM.YYYY HH:mm',

  TimeToNow = '%time-to-now%',
  TimeFromNow = '%time-from-now%',
  /**
   * 05 Январь
   */
  DayFullMonth = 'DD MMMM',
  DayFullMonthTime = 'DD MMMM, HH:mm',
  DayMonth = 'DD.MM',
  /**
   * Янв Фев Мар
   */
  MonthShort = 'MMM',
  /**
   * Январь Февраль
   */
  MonthFull = 'MMMM',
  Time = 'HH:mm',
  TimeFull = 'HH:mm:ss',
  ISO = 'YYYY-MM-DD[T]HH:mm:ss',
  InternalTime = 'HH:mm:ss.SSS',
  InternalDate = 'YYYY-MM-DD',
  ShortDatePresentation = 'dd[.] DD MMM',
  InternalDateTime = 'YYYY-MM-DD_HH:mm',
  /**
   * Понедельник Вторник Среда Четверг Пятница Суббота
   */
  WeekDayFull = 'dddd',
}

type RawDate = undefined | null | number | string | Date | LibDateType;

const isValidStringDate = (date: string) =>
  date.toLowerCase() !== 'invalid date';

const validateDate = (date: RawDate): boolean => {
  if (typeof date === 'boolean') return false;
  if (!date) return false;
  if (!isValidStringDate(date.toString())) return false;

  return dateLib(date).isValid();
};

export const formatDate = (date: RawDate, format?: DateFormat) => {
  if (!date) return '';

  if (format === DateFormat.TimeToNow) {
    return dateLib(date).toNow();
  }
  if (format === DateFormat.TimeFromNow) {
    return dateLib(date).fromNow();
  }

  const formatted = dateLib(date).format(format);

  if (!isValidStringDate(formatted)) return '';

  return formatted;
};

type DateParserOptions = {
  // toUTC?: boolean;
  format?: DateFormat;
  // keepLocalTime?: boolean;
};

export const parseDate = (
  rawDate: RawDate,
  { format }: DateParserOptions = {},
): Date | null => {
  const isValid = validateDate(rawDate);

  if (rawDate instanceof Date && isValid) {
    // if (toUTC) {
    //   return dateLib(rawDate).utc(keepLocalTime).toDate();
    // }

    return rawDate;
  }

  const parsed = dateLib(rawDate, format);

  if (!isValid && !isValidStringDate(parsed.toString())) {
    return null;
  }

  // if (toUTC) {
  //   return parsed.utc(keepLocalTime).toDate();
  // }

  return parsed.toDate();
};

export const formatCalendarDate = (
  rawDate: RawDate,
  formats: {
    sameDay: string;
    nextDay: string;
    nextWeek: string;
    lastDay?: string;
    lastWeek?: string;
    sameElse: string;
  },
) => {
  const result = dateLib(rawDate).calendar(null, formats);
  if (!isValidStringDate(result)) return '';
  return result;
};

export const startOfDay = (date: Date) => dateLib(date).startOf('d').toDate();

export const isToday = (date: Date) => {
  const today = new Date();

  return (
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate() &&
    today.getFullYear() === date.getFullYear()
  );
};

export const isTomorrow = (date: Date) => {
  const today = new Date();

  return (
    today.getMonth() === date.getMonth() &&
    today.getDate() + 1 === date.getDate() &&
    today.getFullYear() === date.getFullYear()
  );
};

export const endOfDay = (date: Date) => {
  return dateLib(date).set('h', 23).set('m', 59).set('s', 59).toDate();
};

export const getMsDiff = (dateA: Date, dateB: Date) => {
  return dateA.getTime() - dateB.getTime();
};

export const getTimeDiff = (
  dateA: Date | number | string,
  dateB: Date | number | string,
) => {
  const diff = getMsDiff(toDate(dateA), toDate(dateB));

  return {
    minutes: Math.max(Math.floor(diff / ms(1, 'min')), 0),
    seconds: Math.max(Math.floor((diff % ms(1, 'min')) / 1000), 0),
  };
};

export const getHoursDiff = (dateA: Date, dateB: Date) => {
  const diff = getMsDiff(dateA, dateB);

  return Math.round(diff / ms(1, 'hour'));
};

export const addDays = (date: RawDate, count: number) =>
  dateLib(date).add(count, 'd').toDate();
export const subtractDays = (date: RawDate, count: number) =>
  dateLib(date).subtract(count, 'd').toDate();

export const addMinutes = (date: RawDate, count: number) =>
  dateLib(date).add(count, 'm').toDate();

export const setMinutes = (date: RawDate, minutes: number) =>
  dateLib(date).set('m', minutes).toDate();

export const setHours = (date: RawDate, hours: number) =>
  dateLib(date).set('h', hours).toDate();

/**
 *
 * @param date
 * @param roundUp - округлить в большую сторону или в меньшую
 */
export const roundMinutes = (date: Date, roundUp?: boolean) => {
  const nextDate = new Date(date);
  const roundedMinutes =
    (Math.floor(nextDate.getMinutes() / 10) + (roundUp ? 1 : 0)) * 10;
  nextDate.setMinutes(roundedMinutes, 0, 0);
  return nextDate;
};

export const getDaysDiff = (date1: RawDate, date2: RawDate) => {
  return dateLib(date1).diff(date2, 'd');
};

export const getMinutesDiff = (date1: RawDate, date2: RawDate) => {
  return dateLib(date1).diff(date2, 'm');
};

export const setTimeToDate = (
  date: RawDate,
  {
    hours,
    minutes,
    seconds,
    ms,
  }: { hours?: number; minutes?: number; seconds?: number; ms?: number },
) => {
  let nextDate = dateLib(date);

  if (hours != null) {
    nextDate = nextDate.set('h', hours);
  }
  if (minutes != null) {
    nextDate = nextDate.set('m', minutes);
  }
  if (seconds != null) {
    nextDate = nextDate.set('s', seconds);
  }
  if (ms != null) {
    nextDate = nextDate.set('ms', ms);
  }

  return nextDate.toDate();
};

export const toDate = (date: Date | number | string) =>
  date instanceof Date ? date : new Date(date);

export const getDateTime = (date: Date | number) => {
  if (date instanceof Date) return date.getTime();
  return date;
};
