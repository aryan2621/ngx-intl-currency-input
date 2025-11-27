import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxIntlCurrencyInputComponent } from './ngx-intl-currency-input.component';

@NgModule({
  declarations: [NgxIntlCurrencyInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BsDropdownModule.forRoot()],
  exports: [NgxIntlCurrencyInputComponent],
})
export class NgxIntlCurrencyInputModule {}
