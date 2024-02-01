import { typeGuard } from '@/shared/lib/common/type-guard';
import { NO_VALUE } from './constants';
import { parseSetting } from './utils';

export const number = function (
  value: Maybe<string | number>,
  settings?: Maybe<{
    digits?: number;
    delimiter?: string;
    digitsOnlyForFloat?: boolean;
    emptyText?: string;
    cutZeros?: boolean;
  }>,
) {
  /*WARNING due to the use of toFixed value is rounded if neccecary*/
  const digits = parseSetting(settings, 'digits', 0);
  const delimiter = parseSetting(settings, 'delimiter', ' ');
  const emptyText = parseSetting(settings, 'emptyText', NO_VALUE);
  const digitsOnlyForFloat = parseSetting(
    settings,
    'digitsOnlyForFloat',
    false,
  );

  if (typeGuard.isNumber(value)) {
    const x = value.toFixed(digits).split('.');
    let x1 = x[0];
    let x2 = '';
    if (x.length > 1 && (!digitsOnlyForFloat || !/^0+$/.test(x[1]))) {
      x2 = '.' + x[1];
    }
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + delimiter + '$2');
    }
    return x1 + x2;
  }
  // } else if (typeGuard.isString(value)) {
  //   try {
  //     const v = new BigNumber(value);
  //     if (v.isNaN()) {
  //       return emptyText;
  //     }
  //     return v.toFormat(digits, {
  //       groupSeparator: delimiter,
  //       decimalSeparator: '.',
  //       groupSize: 3,
  //       secondaryGroupSize: 3,
  //     });
  //     // eslint-disable-next-line no-empty
  //   } catch (ex) {}
  // }

  return emptyText;
};
