import { Component, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})

export class MessageDialog {
  constructor(private dialogRef: MatDialogRef<MessageDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  public closeDialog() {
    this.dialogRef.close();
  }
}