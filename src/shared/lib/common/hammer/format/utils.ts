export function parseSetting<O extends AnyObject, K extends keyof O>(
  settings: Maybe<O>,
  name: K,
): Maybe<O[K]>;
export function parseSetting<O extends AnyObject, K extends keyof O>(
  settings: Maybe<O>,
  name: K,
  defaultValue: O[K],
): Required<O>[K];
export function parseSetting(
  settings: Maybe<AnyObject>,
  name: string,
  defaultValue?: unknown,
) {
  return settings && typeof settings[name] !== 'undefined'
    ? settings[name]
    : defaultValue;
}

export const skipSpaces = (value: string) => value.replace(/\s/g, '');
