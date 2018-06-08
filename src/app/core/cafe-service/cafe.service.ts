import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

import { Cafe } from '../models/cafe.model';
import { Tables } from '../models/table.model';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Injectable()
export class CafeService {
  cafeRef: AngularFirestoreCollection<Cafe> = this.afs.collection("cafes");
  tablesRef: AngularFirestoreCollection<Tables> = this.afs.collection("tables");

  constructor(private afs: AngularFirestore, private dialog: MatDialog) {}

  showMessageDialog(message: string): void {
    this.dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  pushCafe(obj: Cafe, arr?: Array<[0]>) {
    return this.cafeRef.add(obj)
    .then(docRef => {
      this.cafeRef.doc(docRef.id).update({ tablesId: docRef.id });
      this.tablesRef.doc(docRef.id).set({ cafeId: docRef.id, tables: arr });
    })
    .then(() => this.showMessageDialog('Ваш заклад буде опубліковано на нашому сайті, після того як адміністратор його перевірить '))
    .catch(error => this.showMessageDialog(error.message));
  }
}
