import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CurrencyISO } from 'projects/ngx-intl-currency-input/src/lib/enums/currency-iso.enum';
import { CurrencyFormat } from 'projects/ngx-intl-currency-input/src/public_api';
import { SearchCurrencyField } from 'projects/ngx-intl-currency-input/src/lib/enums/search-currency-field.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  separateDialCode = false;
  SearchCurrencyField = SearchCurrencyField;
  CurrencyISO = CurrencyISO;
  CurrencyFormat = CurrencyFormat;
  preferredCurrencies: CurrencyISO[] = [CurrencyISO.USD, CurrencyISO.EUR];
  currencyForm = new FormGroup({
    amount: new FormControl(undefined, [Validators.required]),
  });

  ngOnInit() {
    // Subscribe to form value changes
    this.currencyForm.valueChanges.subscribe(values => {
      console.log('=== Form Value Changes ===');
      console.log('Form Values:', values);
      this.logFormState();
    });

    // Subscribe to amount control changes
    this.currencyForm.get('amount')?.valueChanges.subscribe(value => {
      console.log('=== Amount Control Changed ===');
      console.log('Amount Value:', value);
      this.logAmountControlState();
    });

    // Subscribe to status changes
    this.currencyForm.statusChanges.subscribe(status => {
      console.log('=== Form Status Changed ===');
      console.log('Form Status:', status);
      this.logFormState();
    });

    // Initial log
    console.log('=== Initial Component State ===');
    this.logFormState();
  }

  changePreferredCurrencies() {
    this.preferredCurrencies = [CurrencyISO.GBP, CurrencyISO.JPY];
    console.log('=== Preferred Currencies Changed ===');
    console.log('New Preferred Currencies:', this.preferredCurrencies);
  }

  private logFormState() {
    const amountControl = this.currencyForm.get('amount');

    console.log('--- Form State ---');
    console.log('Form Valid:', this.currencyForm.valid);
    console.log('Form Invalid:', this.currencyForm.invalid);
    console.log('Form Pristine:', this.currencyForm.pristine);
    console.log('Form Dirty:', this.currencyForm.dirty);
    console.log('Form Touched:', this.currencyForm.touched);
    console.log('Form Untouched:', this.currencyForm.untouched);
    console.log('Form Status:', this.currencyForm.status);
    console.log('Form Value:', this.currencyForm.value);
    console.log('Form Errors:', this.currencyForm.errors);

    if (amountControl) {
      console.log('\n--- Amount Control State ---');
      this.logAmountControlState();
    }
  }

  private logAmountControlState() {
    const amountControl = this.currencyForm.get('amount');

    if (amountControl) {
      console.log('Amount Value:', amountControl.value);
      console.log('Amount Valid:', amountControl.valid);
      console.log('Amount Invalid:', amountControl.invalid);
      console.log('Amount Pristine:', amountControl.pristine);
      console.log('Amount Dirty:', amountControl.dirty);
      console.log('Amount Touched:', amountControl.touched);
      console.log('Amount Untouched:', amountControl.untouched);
      console.log('Amount Status:', amountControl.status);
      console.log('Amount Errors:', amountControl.errors);
      console.log('Amount Validators:', amountControl.hasValidator(Validators.required) ? 'Has Required Validator' : 'No Required Validator');
    }
  }
}
