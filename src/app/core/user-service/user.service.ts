import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { User } from "../models/user.model";
import { map,tap, switchMap } from 'rxjs/operators';

import { Subject, Observable } from 'rxjs';

@Injectable()
export class UserService {
  completed = new Subject<User>();
  constructor(private _afs: AngularFirestore) {}

  getUser(userId) { 
    return this._afs.collection('users', ref => ref.where('uid', '==', userId)).valueChanges();
  }

  updateUser(user: User) {
    return this._afs.doc(`users/${user.uid}`).update(user);
  }

  approveReservation(user) {
    return this._afs.doc(`users/${user.uid}`).update(user)
  }

  userBooking(userId, cafeId, approvedBoking, reservedTime, reservationValidTill) {
    return this._afs.doc(`users/${userId}`).update({
      reserved: {
        cafeId,
        approvedBoking,
        reservedTime,
        reservationValidTill
      }
    });
  }
}
