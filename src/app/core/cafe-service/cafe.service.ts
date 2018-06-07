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
  constructor() {}
  }