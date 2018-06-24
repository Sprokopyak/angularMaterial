import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Star } from '../models/rating.model';

@Injectable()
export class RatingService {

  constructor(private _afs: AngularFirestore) { }

  getUserStars(userId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('userId', '==', userId) );
    return starsRef.valueChanges();
  }

  postRating(starObj: Star) {
    const starPath = `stars/${starObj.userId}_${starObj.cafeId}`;
    return this._afs.doc(starPath).set(starObj)
  }

  getCafeRating(cafeId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('cafeId', '==', cafeId) );
    return starsRef.valueChanges();
  }

  setCafeRating(cafeId, avRating: number) {
    return this._afs.doc(`cafes/${cafeId}`).update({ avRating: avRating })
  }

}