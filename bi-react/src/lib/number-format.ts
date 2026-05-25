export const MAX_MONEY_AMOUNT = 1_000_000_000;

export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export const formatNumberWithCommas = (value: string | number | null | undefined) => {
  const digits = digitsOnly(String(value ?? ''));
  return digits ? Number(digits).toLocaleString('en-US') : '';
};

export const parseLimitedIntegerInput = (
  value: string,
  max: number,
) => {
  const digits = digitsOnly(value);
  if (!digits) return '';

  const limited = Math.min(Number(digits), max);
  return String(limited);
};
