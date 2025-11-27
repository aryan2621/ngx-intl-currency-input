import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, AbstractControl } from "@angular/forms";

import { setTheme } from "ngx-bootstrap/utils";

import { CurrencyCode } from "./data/currency-code";
import { CurrencyISO } from "./enums/currency-iso.enum";
import { SearchCurrencyField } from "./enums/search-currency-field.enum";
import { ChangeData } from "./interfaces/change-data";
import { Currency } from "./model/currency.model";
import { currencyAmountValidator } from "./ngx-currency-input.validator";
import { CurrencyFormat } from "./enums/currency-format.enum";

@Component({
  selector: "ngx-currency-input",
  templateUrl: "./ngx-currency-input.component.html",
  styleUrls: ["./bootstrap-dropdown.css", "./ngx-currency-input.component.css"],
  providers: [
    CurrencyCode,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxCurrencyInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NgxCurrencyInputComponent),
      multi: true,
    },
  ],
})
export class NgxCurrencyInputComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
  @Input() value: string | undefined = "";
  @Input() preferredCurrencies: Array<string> = [];
  @Input() enablePlaceholder = true;
  @Input() customPlaceholder: string;
  @Input() currencyFormat: CurrencyFormat = CurrencyFormat.LOCALE_DEFAULT;
  @Input() cssClass = "form-control";
  @Input() onlyCurrencies: Array<string> = [];
  @Input() searchCurrencyFlag = false;
  @Input() searchCurrencyField: SearchCurrencyField[] = [
    SearchCurrencyField.Code,
    SearchCurrencyField.Name,
    SearchCurrencyField.Symbol,
  ];
  @Input() searchCurrencyPlaceholder = "Search Currency";
  @Input() maxLength: number;
  @Input() selectFirstCurrency = true;
  @Input() selectedCurrencyISO: CurrencyISO;
  @Input() currencyValidation = true;
  @Input() inputId = "amount";
  @Input() separateDialCode = false;
  @Input() minAmount: number;
  @Input() maxAmount: number;
  @Input() allowNegative = false;
  separateDialCodeClass: string;

  @Output() readonly currencyChange = new EventEmitter<Currency>();

  selectedCurrency: Currency = {
    code: "USD",
    name: "United States Dollar",
    symbol: "$",
    symbolNative: "$",
    decimalDigits: 2,
    locale: "en-US",
  };

  currencyPlaceholder: string = "";

  amount: string | undefined = "";
  allCurrencies: Array<Currency> = [];
  preferredCurrenciesInDropDown: Array<Currency> = [];
  filteredCurrencies: Array<Currency> = [];
  disabled = false;
  currencySearchText = "";
  private validatorFn: any;

  @ViewChild("currencyList") currencyList: ElementRef;

  onTouched = () => {};
  propagateChange = (_: ChangeData | null) => {};

  constructor(private currencyCodeData: CurrencyCode) {
    setTheme("bs4");
  }

  ngOnInit() {
    this.init();
    this.updateValidatorFn();
  }

  ngOnChanges(changes: SimpleChanges) {
    const selectedISO = changes["selectedCurrencyISO"];
    if (
      this.allCurrencies &&
      selectedISO &&
      selectedISO.currentValue !== selectedISO.previousValue
    ) {
      this.updateSelectedCurrency();
    }
    if (changes["preferredCurrencies"]) {
      this.updatePreferredCurrencies();
    }

    // Update validator when validation params change
    if (changes["currencyValidation"] || changes["minAmount"] || changes["maxAmount"] ||
        changes["allowNegative"] || changes["selectedCurrencyISO"]) {
      this.updateValidatorFn();
    }

    this.checkSeparateDialCodeStyle();
  }

  init() {
    this.fetchCurrencyData();
    if (this.preferredCurrencies.length) {
      this.updatePreferredCurrencies();
    }
    if (this.onlyCurrencies.length) {
      this.allCurrencies = this.allCurrencies.filter((c) =>
        this.onlyCurrencies.includes(c.code)
      );
    }
    this.filteredCurrencies = [...this.allCurrencies];

    if (this.selectFirstCurrency) {
      if (this.preferredCurrenciesInDropDown.length) {
        this.setSelectedCurrency(this.preferredCurrenciesInDropDown[0]);
      } else if (this.allCurrencies.length > 0) {
        this.setSelectedCurrency(this.allCurrencies[0]);
      }
    }
    this.updateSelectedCurrency();
    this.checkSeparateDialCodeStyle();
  }

  setSelectedCurrency(currency: Currency) {
    this.selectedCurrency = currency;
    this.currencyChange.emit(currency);
  }

  public searchCurrency() {
    if (!this.currencySearchText) {
      this.filteredCurrencies = [...this.allCurrencies];
      return;
    }

    const searchText = this.currencySearchText.toLowerCase();
    this.filteredCurrencies = this.allCurrencies.filter((currency) => {
      return (
        (this.shouldSearchField(SearchCurrencyField.Code) && currency.code.toLowerCase().includes(searchText)) ||
        (this.shouldSearchField(SearchCurrencyField.Name) && currency.name.toLowerCase().includes(searchText)) ||
        (this.shouldSearchField(SearchCurrencyField.Symbol) && currency.symbol.toLowerCase().includes(searchText))
      );
    });

    this.checkSeparateDialCodeStyle();
  }

  private shouldSearchField(field: SearchCurrencyField): boolean {
    return this.searchCurrencyField.includes(field);
  }

  public onAmountChange(): void {
    let currencyCode: string | undefined;
    if (this.amount && typeof this.amount === "object") {
      const amountObj: ChangeData = this.amount;
      this.amount = amountObj.rawValue;
      currencyCode = amountObj.currencyCode;
    }

    this.value = this.amount;
    currencyCode = currencyCode || this.selectedCurrency.code;

    this.checkSeparateDialCodeStyle();
    this.propagateChange(this.buildChangeData(this.value));
  }

  public onCurrencySelect(currency: Currency, el: { focus: () => void }): void {
    this.setSelectedCurrency(currency);
    this.checkSeparateDialCodeStyle();
    this.propagateChange(this.buildChangeData(this.amount));
    el.focus();
  }

  private buildChangeData(value: string | undefined): ChangeData | null {
    if (!value || value.length === 0) {
      return null;
    }

    const numericValue = this.parseAmount(value);
    const formattedAmount = this.formatAmount(numericValue);

    return {
      amount: numericValue,
      formattedAmount: formattedAmount,
      currencyCode: this.selectedCurrency.code.toUpperCase(),
      currencySymbol: this.selectedCurrency.symbol,
      rawValue: value,
    };
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const key = event.key;

    // Allow control keys and navigation
    if (this.isControlKey(event) || this.isNavigationKey(key)) {
      return;
    }

    // Allow digits
    if (/[0-9]/.test(key)) {
      return;
    }

    // Handle negative sign
    if (key === '-' && this.allowNegative) {
      this.handleNegativeSign(event);
      return;
    }

    // Handle decimal point
    if (key === '.' || key === ',') {
      this.handleDecimal(event);
      return;
    }

    // Block all other characters
    event.preventDefault();
  }

  private isControlKey(event: KeyboardEvent): boolean {
    const allowedCtrlChars = /[axcv]/;
    return (event.ctrlKey || event.metaKey) && allowedCtrlChars.test(event.key);
  }

  private isNavigationKey(key: string): boolean {
    const navigationKeys = [
      "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
      "Home", "End", "Insert", "Delete", "Backspace", "Tab"
    ];
    return navigationKeys.includes(key);
  }

  private handleNegativeSign(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const selectionStart = input.selectionStart || 0;
    const currentValue = input.value || '';

    if (selectionStart !== 0 || currentValue.includes('-')) {
      event.preventDefault();
    }
  }

  private handleDecimal(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value || '';

    // If already has decimal, prevent
    if (currentValue.includes('.')) {
      event.preventDefault();
      return;
    }

    // Normalize comma to dot
    if (event.key === ',') {
      event.preventDefault();
      const selectionStart = input.selectionStart || 0;
      const newValue = currentValue.slice(0, selectionStart) + '.' + currentValue.slice(selectionStart);
      input.value = newValue;
      input.setSelectionRange(selectionStart + 1, selectionStart + 1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (obj === undefined || obj === null) {
      this.amount = "";
    } else {
      this.amount = obj;
    }
    // Use Promise.resolve for proper change detection instead of setTimeout
    Promise.resolve().then(() => {
      this.onAmountChange();
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validatorFn ? this.validatorFn(control) : null;
  }

  resolvePlaceholder(): string {
    if (this.customPlaceholder) {
      return this.customPlaceholder;
    }
    return this.currencyPlaceholder;
  }

  private parseAmount(value: string): number {
    if (!value) return 0;
    const cleanValue = value.replace(/[^\d\.\-]/g, "");
    return parseFloat(cleanValue) || 0;
  }

  private formatAmount(value: number): string {
    if (isNaN(value)) return "";

    try {
      const formatter = new Intl.NumberFormat(this.selectedCurrency.locale, {
        style: "currency",
        currency: this.selectedCurrency.code.toUpperCase(),
        minimumFractionDigits: this.selectedCurrency.decimalDigits,
        maximumFractionDigits: this.selectedCurrency.decimalDigits,
      });

      return formatter.format(value);
    } catch (e) {
      return `${this.selectedCurrency.symbol}${value.toFixed(this.selectedCurrency.decimalDigits)}`;
    }
  }

  private checkSeparateDialCodeStyle() {
    if (this.separateDialCode && this.selectedCurrency) {
      const symbol = this.selectedCurrency.symbol;
      this.separateDialCodeClass =
        "separate-dial-code iti-sdc-" + (symbol.length + 1);
    } else {
      this.separateDialCodeClass = "";
    }
  }

  private updatePlaceholder(): void {
    if (!this.enablePlaceholder) {
      this.currencyPlaceholder = "";
      return;
    }

    try {
      const formatter = new Intl.NumberFormat(this.selectedCurrency.locale, {
        style: "decimal",
        minimumFractionDigits: this.selectedCurrency.decimalDigits,
        maximumFractionDigits: this.selectedCurrency.decimalDigits,
      });
      this.currencyPlaceholder = formatter.format(1234.56);
    } catch (e) {
      this.currencyPlaceholder = "1,234.56";
    }
  }

  protected fetchCurrencyData(): void {
    this.allCurrencies = [];

    this.currencyCodeData.allCurrencies.forEach((c) => {
      const currency: Currency = {
        name: c[0].toString(),
        code: c[1].toString(),
        symbol: c[2].toString(),
        symbolNative: c[3].toString(),
        decimalDigits: +c[4] || 2,
        locale: c[5].toString(),
      };

      this.allCurrencies.push(currency);
    });
  }

  private updatePreferredCurrencies() {
    if (this.preferredCurrencies.length) {
      this.preferredCurrenciesInDropDown = [];
      this.preferredCurrencies.forEach((code) => {
        const preferredCurrency = this.allCurrencies.filter((c) => {
          return c.code === code;
        });

        if (preferredCurrency.length > 0) {
          this.preferredCurrenciesInDropDown.push(preferredCurrency[0]);
        }
      });
    }
  }

  private updateSelectedCurrency() {
    if (this.selectedCurrencyISO) {
      const foundCurrency = this.allCurrencies.find((c) => {
        return c.code.toLowerCase() === this.selectedCurrencyISO.toLowerCase();
      });

      if (foundCurrency) {
        this.selectedCurrency = foundCurrency;
        this.updatePlaceholder();
        this.updateValidatorFn();
        if (this.amount) {
          this.onAmountChange();
        } else {
          this.propagateChange(null);
        }
      } else {
        console.warn(`Currency code "${this.selectedCurrencyISO}" not found in available currencies`);
      }
    }
  }

  private updateValidatorFn() {
    this.validatorFn = currencyAmountValidator(
      this.currencyValidation,
      this.minAmount,
      this.maxAmount,
      this.allowNegative,
      this.selectedCurrency?.decimalDigits
    );
  }
}
