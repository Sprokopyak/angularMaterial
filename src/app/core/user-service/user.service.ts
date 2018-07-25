import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(private _afs: AngularFirestore) {}

  getUser(userId) {
    return this._afs.doc(`users/${userId}`).valueChanges();
  }

  updateUser(user: User) {
    return this._afs.doc(`users/${user.uid}`).update(user);
  }

  approveReservation(user) {
    return this._afs.doc(`users/${user.uid}`).update(user)
  }

  userBooking(userId, cafeId, approvedBoking, reservedTime, reservationValidTill, visitorsNumber) {
    return this._afs.doc(`users/${userId}`).update({
      reserved: {
        cafeId,
        approvedBoking,
        reservedTime,
        reservationValidTill,
        visitorsNumber
      }
    });
  }

  getUserStars(userId) {
    const starsRef = this._afs.collection('stars', ref =>
      ref.where('userId', '==', userId)
    );
    return starsRef.valueChanges();
  }
}
