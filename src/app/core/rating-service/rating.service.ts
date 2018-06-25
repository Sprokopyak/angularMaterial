import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Star } from '../models/rating.model';
import { CafeComments } from '../models/comments.model'
import { map } from 'rxjs/operators'

@Injectable()
export class RatingService {

  constructor(private _afs: AngularFirestore) { }

  getUserStars(userId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('userId', '==', userId));
    return starsRef.valueChanges();
  }

  getCafeComments(cafeId) {
    return this._afs.collection("comments", ref => ref.where('cafeId', '==', cafeId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as CafeComments;
          return data;
        });
      })
    )
  }

  postComments(comment: CafeComments, cafeId) {
    this._afs.collection("comments").add({
      username: comment.username,
      comment: comment.comment,
      cafeId: cafeId,
      date: new Date().toLocaleString()
    });
  }

  postRating(starObj: Star) {
    const starPath = `stars/${starObj.userId}_${starObj.cafeId}`;
    return this._afs.doc(starPath).set(starObj)
  }

  getCafeRating(cafeId) {
    const starsRef = this._afs.collection('stars', ref => ref.where('cafeId', '==', cafeId));
    return starsRef.valueChanges();
  }

  setCafeRating(cafeId, avRating: number) {
    return this._afs.doc(`cafes/${cafeId}`).update({ avRating: avRating })
  }

}