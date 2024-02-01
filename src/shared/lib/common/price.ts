export interface PriceFormatOptions
  extends Partial<Omit<Intl.NumberFormatOptions, 'currency'>> {
  withoutSymbol?: boolean;
}

export const formatPrice = (
  price: number,
  locale: string,
  currency?: string,
  { withoutSymbol, ...options }: PriceFormatOptions = {},
) => {
  const priceFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol',
    ...options,
  });

  const zeroPrice = priceFormatter.format(0);
  const currencySymbol = zeroPrice.replace('0', '');
  const rawPrice = priceFormatter.format(price);
  const priceWithoutCurrency = rawPrice.replace(currencySymbol, '');

  if (withoutSymbol) {
    return priceWithoutCurrency;
  }

  return `${priceWithoutCurrency} ${
    currency === 'RUB' ? 'р' : currencySymbol
  }`.replace(/\s{2,}/, ' ');
};
