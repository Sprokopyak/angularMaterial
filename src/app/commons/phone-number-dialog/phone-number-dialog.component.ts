import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'phone-number-dialog',
  templateUrl: './phone-number-dialog.component.html',
  styleUrls: ['./phone-number-dialog.component.scss']
})

export class PhoneNumberDialog {
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<PhoneNumberDialog>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.form = this._fb.group({
      phoneNumber: ['380', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('[0-9]*')]],
    })
  }

  submit(form) {
    this.dialogRef.close(`${form.value.phoneNumber}`);
  }
}