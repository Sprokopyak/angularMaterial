import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialog {
  public confirmMessage:string;
  constructor(private dialogRef: MatDialogRef<ConfirmDialog>) {

  }

  submit(form) {
    this.dialogRef.close(`${form.value.phoneNumber}`);
  }
}