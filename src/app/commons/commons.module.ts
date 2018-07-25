import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageDialog } from './message-dialog/message-dialog.component';
import { PhoneNumberDialog } from './phone-number-dialog/phone-number-dialog.component';
import { MaterialModule } from '../material/material.module';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MessageDialog,
    PhoneNumberDialog,
    ConfirmDialog
  ],
  exports: [
    MessageDialog,
    PhoneNumberDialog,
    ConfirmDialog
  ],
  entryComponents: [
    MessageDialog,
    PhoneNumberDialog,
    ConfirmDialog
  ]
})
export class CommonsModule { }