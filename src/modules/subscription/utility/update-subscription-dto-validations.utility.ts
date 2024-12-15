export function isGreaterThanOrEqualToCurrentYear(value: number): boolean {
  const currentYear = new Date().getFullYear();
  return value >= currentYear;
}

export function isValidCreditCardCSV(value: string): boolean {
  const isVisaMasterCardOrOther = /^[0-9]{3}$/; // 3 digits for Visa, MasterCard, etc.
  return isVisaMasterCardOrOther.test(value);
}

export function isValidCreditCardNumber(value: string): boolean {
  // length of 13 to 19 digits
  if (!/^\d{13,19}$/.test(value)) {
    return false;
  }

  // Luhn Algorithm
  let sum = 0;
  let shouldDouble = false;

  // Traverse the digits in reverse order
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble; // Alternate between doubling and not doubling
  }

  return sum % 10 === 0;
}
