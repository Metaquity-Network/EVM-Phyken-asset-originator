export function numberToCommaSeparator(number: number, locale?: string): string {
  if (locale === 'en-IN') {
    const options: Intl.NumberFormatOptions = {
      maximumFractionDigits: 2,
      useGrouping: true,
    };
    return number.toLocaleString('en-IN', options);
  } else {
    const options: Intl.NumberFormatOptions = {
      maximumFractionDigits: 2,
      useGrouping: true,
    };
    return number.toLocaleString('en-US', options);
  }
}
