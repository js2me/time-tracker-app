/**
 * Склонение слова в зависимости от количества
 * @example
 * declension(1, ['слово', 'слова', 'слов']) // 'слово'
 * @example
 * declension(2, ['слово', 'слова', 'слов']) // 'слова'
 * @example
 * declension(5, ['слово', 'слова', 'слов']) // 'слов'
 */
export const declension = (
  count: number,
  txt: [one: string, two: string, five: string],
  cases = [2, 0, 1, 1, 1, 2],
) =>
  txt[
    count % 100 > 4 && count % 100 < 20
      ? 2
      : cases[count % 10 < 5 ? count % 10 : 5]
  ];

export const formatPhone = (str: string) => str.replace(/[()-]|\s/g, '');

export const isEmailValid = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  /^[A-Za-z0-9._+\-']{1,61}@[A-Za-z0-9.-]{2,61}\.[A-Za-z]{2,11}$/.test(str);

export const isPhoneValid = (str: string) => {
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/g.test(
    formatPhone(str),
  );
};
