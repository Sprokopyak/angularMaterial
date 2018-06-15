import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { Star } from '../models/rating.model';

@Injectable()
export class RatingService {

  constructor(private _afs: AngularFirestore) { }

  getUserStars(userId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('userId', '==', userId) );
    return starsRef.valueChanges();
  }

  getCafeStars(cafeId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('cafeId', '==', cafeId) );
    return starsRef.valueChanges();
  }


  setStar(userId, cafeId, ratingValue) {
    const star: Star = { userId, cafeId, ratingValue };
    const starPath = `stars/${star.userId}_${star.cafeId}`;

    return this._afs.doc(starPath).set(star)
  }

  postRating(starObj: Star) {
    const starPath = `stars/${starObj.userId}_${starObj.cafeId}`;
    return this._afs.doc(starPath).set(starObj)
  }

  getCafeRating(cafeId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('cafeId', '==', cafeId) );
    return starsRef.valueChanges();
  }

  setCafeRating(cafeId, avRating) {
    return this._afs.doc(`cafes/${cafeId}`).update({ avRating: avRating })
  }

}