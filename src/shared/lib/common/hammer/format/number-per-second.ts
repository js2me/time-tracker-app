import { typeGuard } from '@/shared/lib/common/type-guard';
import { NO_VALUE } from './constants';
import { number } from './number';

export const numberPerSecond = function (
  value: Maybe<string | number>,
  settings?: Maybe<{
    digits?: number;
    delimiter?: string;
    digitsOnlyForFloat?: boolean;
    measure?: string;
  }>,
) {
  if (typeGuard.isNumber(value)) {
    return `${number(value, settings)} ${settings?.measure}/s`;
  } else {
    return NO_VALUE;
  }
};
