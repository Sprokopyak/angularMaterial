import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Cafe } from '../models/cafe.model';
import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CafeService {
  cafeTypeFilter$ = new BehaviorSubject(null);
  ratingFilter$ = new BehaviorSubject(null);
  freeTablesFilter$ = new BehaviorSubject(null);

  constructor(private _afs: AngularFirestore,
    private _dialog: MatDialog) {
  }

  showMessageDialog(message: string): void {
    this._dialog.open(MessageDialog, {
      width: '450px',
      data: message
    });
  }

  pushCafe(obj: Cafe) {
    return this._afs.collection('cafes').add(obj)
      .then(docRef => {
        this._afs.collection('cafes').doc(docRef.id).update({ id: docRef.id });
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
    return this._afs.doc(`cafes/${id}`).valueChanges();
  }

  updateCafe(cafe: Cafe) {
    return this._afs.doc(`cafes/${cafe.id}`).update(cafe);
  }

  searchCafe(start, end) {
    return this._afs.collection('cafes', ref => ref.limit(4).orderBy('cafeName').startAt(start).endAt(end)).valueChanges();
  }

  filters(){
    return this._afs.collection('cafes', ref => {
      let query: any = ref;
      if (this.cafeTypeFilter$.value) { query = query.where('cafeType', '==', this.cafeTypeFilter$.value);}
      if (this.freeTablesFilter$.value) { query = query.where('freeTables', '!=', this.freeTablesFilter$.value); }
      if (this.ratingFilter$.value) { query = query.where('avRating', '>=', this.ratingFilter$.value); }
      return query;
    }).valueChanges();
  }

  deleteCafe(cafeId){
    return this._afs.collection('cafes').doc(cafeId).delete();
  }
}