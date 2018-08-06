import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialog {
  public confirmMessage:string;
  constructor(public dialogRef: MatDialogRef<ConfirmDialog>) {
  }

  submit(form) {
    this.dialogRef.close(`${form.value.phoneNumber}`);
  }
}