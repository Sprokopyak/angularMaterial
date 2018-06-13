import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { Star } from '../models/rating.model';

@Injectable()
export class StarService {

  constructor(private _afs: AngularFirestore) { }

  getUserStars(userId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('userId', '==', userId) );
    return starsRef.valueChanges();
  }

  getMovieStars(cafeId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('cafeId', '==', cafeId) );
    return starsRef.valueChanges();
  }


  setStar(userId, cafeId, value) {
    const star: Star = { userId, cafeId, value };
    const starPath = `stars/${star.userId}_${star.cafeId}`;

    return this._afs.doc(starPath).set(star)
  }

}