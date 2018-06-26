import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { Cafe } from '../models/cafe.model';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Injectable()
export class CafeService {
  cafeRef: AngularFirestoreCollection<Cafe> = this._afs.collection('cafes');
  cafes$: Observable<any>;
  cafe$: Observable<any>;
  cafeDoc: AngularFirestoreDocument<Cafe>;

  constructor(private _afs: AngularFirestore,
    private _dialog: MatDialog) {
    this.cafes$ = this.cafeRef.valueChanges();
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
      .then(() => this.showMessageDialog('Ваш заклад буде опубліковано на нашому сайті, після того як адміністратор його перевірить'))
      .catch(error => this.showMessageDialog(error.message));
  }

  getCafeList(){
    return this._afs.collection('cafes', ref => ref.where('approved', '==', false)).valueChanges();
  }

  getCafes() {
    return this._afs.collection('cafes', ref => ref.limit(2).orderBy('avRating', 'desc')).valueChanges();
  }

  getCafe(id: string) {
    return this.cafe$ = this._afs.doc(`cafes/${id}`).valueChanges();
  }

  updateCafe(cafe: Cafe) {
    return this._afs.doc(`cafes/${cafe.id}`).update(cafe);
  }

  searchCafe(start, end) {
    return this._afs.collection('cafes', ref => ref.limit(4).orderBy('cafeName').startAt(start).endAt(end)).valueChanges();
  }

  deleteCafe(cafeId){
    return this._afs.collection('cafes').doc(cafeId).delete();
  }
}