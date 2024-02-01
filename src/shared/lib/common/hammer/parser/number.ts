import { hammer } from '@/shared/lib/common/hammer';
import { typeGuard } from '@/shared/lib/common/type-guard';

export const number = (input: Maybe<string | number>) => {
  if (typeGuard.isNumber(input)) {
    return input;
  }

  if (typeGuard.isString(input)) {
    return Number(hammer.format.skipSpaces(input));
  }

  return 0;
};
