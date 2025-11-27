import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class CurrencyValidators {
  static min(minAmount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const amount = this.extractAmount(control.value);
      if (isNaN(amount)) return null;

      return amount < minAmount
        ? { minAmount: { message: `Amount must be at least ${minAmount}`, min: minAmount, actual: amount } }
        : null;
    };
  }

  static max(maxAmount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const amount = this.extractAmount(control.value);
      if (isNaN(amount)) return null;

      return amount > maxAmount
        ? { maxAmount: { message: `Amount must not exceed ${maxAmount}`, max: maxAmount, actual: amount } }
        : null;
    };
  }

  static decimalPlaces(digits: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const rawValue = typeof control.value === 'object' ? control.value.rawValue : String(control.value);
      const parts = rawValue.replace(/[^\d\.]/g, '').split('.');

      if (parts.length > 1 && parts[1].length > digits) {
        return {
          decimalPlaces: {
            message: `Maximum ${digits} decimal places allowed`,
            max: digits,
            actual: parts[1].length
          }
        };
      }

      return null;
    };
  }

  static noNegative(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const amount = this.extractAmount(control.value);
      if (isNaN(amount)) return null;

      return amount < 0
        ? { negative: { message: 'Negative amounts are not allowed' } }
        : null;
    };
  }

  static validNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const amount = this.extractAmount(control.value);

      return isNaN(amount)
        ? { invalidCurrency: { message: 'Invalid amount' } }
        : null;
    };
  }

  private static extractAmount(value: any): number {
    return typeof value === 'object'
      ? value.amount
      : parseFloat(String(value).replace(/[^\d\.\-]/g, ''));
  }
}

// Backward compatibility function
export function currencyAmountValidator(
  currencyValidation: boolean,
  minAmount?: number,
  maxAmount?: number,
  allowNegative?: boolean,
  decimalDigits?: number
): ValidatorFn {
  if (!currencyValidation) {
    return () => null;
  }

  const validators: ValidatorFn[] = [CurrencyValidators.validNumber()];

  if (minAmount !== undefined) {
    validators.push(CurrencyValidators.min(minAmount));
  }

  if (maxAmount !== undefined) {
    validators.push(CurrencyValidators.max(maxAmount));
  }

  if (decimalDigits !== undefined) {
    validators.push(CurrencyValidators.decimalPlaces(decimalDigits));
  }

  if (!allowNegative) {
    validators.push(CurrencyValidators.noNegative());
  }

  return Validators.compose(validators) || (() => null);
}

