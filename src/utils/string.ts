export const numberToStringEnd = (
  number: number,
  one: string,
  two: string,
  many: string,
): string => {
  try {
    switch (new Intl.PluralRules('ru-RU').select(number)) {
      case 'zero':
        return many;
      case 'one':
        return one;
      case 'two':
        return two;
      case 'few':
        return two;
      case 'many':
        return many;
      case 'other':
        return many;
    }
  } catch {}

  return many;
};
