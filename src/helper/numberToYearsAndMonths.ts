export function convertNumberToMonthsAndYears(inputNumber: number): string {
  if (inputNumber < 12) {
    return `
        ${inputNumber} Months
     `;
  }

  const monthsInYear = 12;
  const years = Math.floor(inputNumber / monthsInYear);
  const remainingMonths = (inputNumber % monthsInYear) / 12;

  return `
        ${years}.${remainingMonths} Years
      `;
}
