# International Currency Input for Angular (NgxIntlCurrencyInput)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/aryan2621/ngx-intl-currency-input)
[![license](https://img.shields.io/github/license/aryan2621/ngx-intl-currency-input)](https://github.com/aryan2621/ngx-intl-currency-input/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/ngx-intl-currency-input)](https://badge.fury.io/js/ngx-intl-currency-input)
[![npm](https://img.shields.io/npm/dm/ngx-intl-currency-input)](https://www.npmjs.com/package/ngx-intl-currency-input)

An Angular package for entering and validating currency amounts with multi-currency support. It adds a currency dropdown to any input, displays the currency symbol, and provides locale-based formatting and validation methods.

**Repository:** [https://github.com/aryan2621/ngx-intl-currency-input](https://github.com/aryan2621/ngx-intl-currency-input)

## Features

- **Multi-currency support**: 58 major world currencies with proper symbols and formatting
- **Locale-aware formatting**: Automatic formatting based on currency locale using `Intl.NumberFormat`
- **Smart validation**: Built-in and composable validators for amount ranges, decimals, and more
- **Searchable dropdown**: Quick currency search by code, name, or symbol
- **Keyboard optimized**: Intelligent input handling for numeric entry with decimal support
- **Flexible styling**: Customizable CSS classes and separate currency code display option
- **Type-safe**: Full TypeScript support with proper interfaces and enums
- **Reactive Forms**: Native Angular Forms integration with `ControlValueAccessor`
- **Clean architecture**: Maintainable codebase with composable validators and DRY principles

**Compatibility:**

| ngx-intl-currency-input | Angular   | ngx-bootstrap |
| ----------------------- | --------- | ------------- |
| 17.x.x                  | >= 17.x.x | >= 12.0.0     |

## Installation

### Install Dependencies

`$ ng add ngx-bootstrap`

If you do not wish to use Bootstrap's global CSS, we now package the project with only the relevant
bootstrap styling needed for the dropdown. As such, you can remove the bootstrap styling from `angular.json`.

### Install This Library

`$ npm install ngx-intl-currency-input --save`

## Usage

### Import

Add `NgxIntlCurrencyInputModule` to your module file:

```javascript
imports: [NgxIntlCurrencyInputModule];
```

## Example

Refer to main app in this repository for working example.

```html
<form #f="ngForm" [formGroup]="currencyForm">
  <ngx-intl-currency-input
    [cssClass]="'custom'"
    [preferredCurrencies]="[CurrencyISO.USD, CurrencyISO.EUR]"
    [enablePlaceholder]="true"
    [searchCurrencyFlag]="true"
    [searchCurrencyField]="[SearchCurrencyField.Code, SearchCurrencyField.Name]"
    [selectFirstCurrency]="false"
    [selectedCurrencyISO]="CurrencyISO.USD"
    [maxLength]="15"
    [currencyValidation]="true"
    [minAmount]="0"
    [maxAmount]="1000000"
    [allowNegative]="false"
    name="amount"
    formControlName="amount"
  ></ngx-intl-currency-input>
</form>
```

## Options

| Options                   | Type                      | Default                         | Description                                                                                                     |
| ------------------------- | ------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| cssClass                  | `string`                  | `control-form`                  | Bootstrap input css class or your own custom one.                                                               |
| preferredCurrencies       | `<CurrencyISO>[]`         | `[]`                            | List of currencies, which will appear at the top.                                                               |
| onlyCurrencies            | `<CurrencyISO>[]`         | `[]`                            | List of manually selected currencies, which will appear in the dropdown.                                        |
| enablePlaceholder         | `boolean`                 | `true`                          | Input placeholder text, which adapts to the currency selected.                                                  |
| customPlaceholder         | `string`                  | `None`                          | Custom string to be inserted as a placeholder.                                                                  |
| currencyFormat            | `<CurrencyFormat>`        | `CurrencyFormat.LOCALE_DEFAULT` | Format for displaying currency amounts.                                                                         |
| searchCurrencyFlag        | `boolean`                 | `false`                         | Enables input search box for currencies in the dropdown.                                                        |
| searchCurrencyField       | `<SearchCurrencyField>[]` | `[Code, Name, Symbol]`          | Customize which fields to search in, if `searchCurrencyFlag` is enabled. Use `SearchCurrencyField` helper enum. |
| searchCurrencyPlaceholder | `string`                  | `'Search Currency'`             | Placeholder value for `searchCurrencyField`                                                                     |
| maxLength                 | `number`                  | `None`                          | Add character limit.                                                                                            |
| selectFirstCurrency       | `boolean`                 | `true`                          | Selects first currency from `preferredCurrencies` if is set. If not then uses main list.                        |
| currencyValidation        | `boolean`                 | `true`                          | Enable/disable currency validation.                                                                             |
| inputId                   | `string`                  | `amount`                        | Unique ID for `<input>` element.                                                                                |
| selectedCurrencyISO       | `<CurrencyISO>`           | `None`                          | Set specific currency on load.                                                                                  |
| separateDialCode          | `boolean`                 | `false`                         | Visually separate currency code into the drop down element.                                                     |
| minAmount                 | `number`                  | `None`                          | Minimum amount validation.                                                                                      |
| maxAmount                 | `number`                  | `None`                          | Maximum amount validation.                                                                                      |
| allowNegative             | `boolean`                 | `false`                         | Allow negative currency amounts.                                                                                |
| currencyChange            | `<Currency>`              | `None`                          | Emits currency value when the user selects a currency from the dropdown.                                        |

## Supported Currencies

This library supports 58 major world currencies including:

- USD (United States Dollar)
- EUR (Euro)
- GBP (British Pound Sterling)
- JPY (Japanese Yen)
- CNY (Chinese Yuan)
- AUD (Australian Dollar)
- CAD (Canadian Dollar)
- CHF (Swiss Franc)
- And many more...

## Currency Formatting

Currency amounts are formatted based on the selected currency's locale:

- **USD**: 1,234.56 (US format)
- **EUR**: 1.234,56 (European format)
- **JPY**: 1,235 (no decimal places)

The library uses the browser's `Intl.NumberFormat` API for accurate locale-based formatting.

## Validation

The library provides comprehensive validation with two approaches:

### 1. Built-in Validation (Automatic)

Simply enable validation via component inputs:

```html
<ngx-intl-currency-input
  [currencyValidation]="true"
  [minAmount]="0"
  [maxAmount]="1000000"
  [allowNegative]="false"
  formControlName="amount"
></ngx-intl-currency-input>
```

### 2. Composable Validators (Advanced)

For more control, use the `CurrencyValidators` class to compose custom validation:

```typescript
import { CurrencyValidators } from "ngx-intl-currency-input";

// Create a form control with composable validators
this.amountControl = new FormControl("", [
  CurrencyValidators.validNumber(),
  CurrencyValidators.min(10),
  CurrencyValidators.max(10000),
  CurrencyValidators.decimalPlaces(2),
  CurrencyValidators.noNegative(),
]);
```

**Available Validators:**

- `CurrencyValidators.validNumber()` - Ensures only valid numbers are entered
- `CurrencyValidators.min(amount)` - Validates minimum amount
- `CurrencyValidators.max(amount)` - Validates maximum amount
- `CurrencyValidators.decimalPlaces(digits)` - Validates decimal precision based on currency
- `CurrencyValidators.noNegative()` - Prevents negative values

**Features:**

- Automatically validates based on currency (e.g., JPY has 0 decimals, most others have 2)
- Works with both raw values and `ChangeData` objects
- Provides detailed error messages
- Fully composable and testable

## Library Contributions

- Fork repo.
- Update `./projects/ngx-intl-currency-input`
- Build / test library.
- Update `./src/app` with new functionality.
- Update README.md
- Pull request.

### Helpful commands

- Build lib: `$ npm run build_lib`
- Copy license and readme files: `$ npm run copy-files`
- Create package: `$ npm run npm_pack`
- Build lib and create package: `$ npm run package`

### Use locally

After building and creating package, you can use it locally too.

In your project run:

`$ npm install --save {{path to your local '*.tgz' package file}}`

## License

MIT

## Contributors

This project is a conversion of the ngx-intl-tel-input library for currency input use cases.
