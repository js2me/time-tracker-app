import dayjs from 'dayjs';

const MULTIPLY_BY_UNIT = {
  ms: 1,
  sec: 1000,
  min: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
} as const;

export const ms = (value: number, unit: keyof typeof MULTIPLY_BY_UNIT = 'ms') =>
  value * MULTIPLY_BY_UNIT[unit];

export const msDuration = (value: number) => {
  const duration = dayjs.duration(value);

  return {
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  };
};
