import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

import { Cafe } from '../models/cafe.model';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Injectable()
export class CafeService {
  cafeRef: AngularFirestoreCollection<Cafe> = this.afs.collection("cafes");

  constructor(private afs: AngularFirestore, 
    private _dialog: MatDialog) {
  }

  showMessageDialog(message: string): void {
    this._dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  pushCafe(obj: Cafe) {
    return this.cafeRef.add(obj)
      .then(docRef => {
        this.cafeRef.doc(docRef.id).update({ id: docRef.id });
      })
      .then(() => this.showMessageDialog('Ваш заклад буде опубліковано на нашому сайті, після того як адміністратор його перевірить '))
      .catch(error => this.showMessageDialog(error.message));
  }
}
