import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})

export class MessageDialog {
  constructor(
    private _dialogRef: MatDialogRef<MessageDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public closeDialog() {
    this._dialogRef.close();
  }
}