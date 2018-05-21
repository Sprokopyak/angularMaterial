import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageDialog } from './message-dialog/message-dialog.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    MessageDialog
  ],
  exports: [MessageDialog],
  entryComponents: [
    MessageDialog
  ]
})
export class CommonsModule { }