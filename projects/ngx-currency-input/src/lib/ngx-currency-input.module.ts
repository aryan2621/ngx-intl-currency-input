import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxCurrencyInputComponent } from './ngx-currency-input.component';

@NgModule({
  declarations: [NgxCurrencyInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BsDropdownModule.forRoot()],
  exports: [NgxCurrencyInputComponent],
})
export class NgxCurrencyInputModule {}
