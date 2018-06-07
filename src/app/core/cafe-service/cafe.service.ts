import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { MatDialog } from '@angular/material';
import { MessageDialog } from '../../commons/message-dialog/message-dialog.component';

@Injectable()
export class CafeService {
  cafeRef: AngularFirestoreDocument<any>;
  cafe$: Observable<any>;

  tablesRef: AngularFirestoreCollection<any> = this.afs.collection('cafes');
  tables= this.tablesRef.valueChanges();
  tables$: Observable<any>;

  constructor(private afs: AngularFirestore) {
    // this.cafe$ = this.afs.collection('cafes').valueChanges();

    // this.cafeRef = this.afs.doc('cafes')
    // this.tablesRef = this.cafeRef.collection('tables' )
    // this.cafe$ = this.cafeRef.valueChanges();
  }

  pushCafe(obj?: object) {
    this.tablesRef.add(obj)
    .then((docRef)=>{
      console.log(docRef);
      
      this.tablesRef.doc(docRef.id).update({
        cafeId: docRef.id
      })
    })
  }

}