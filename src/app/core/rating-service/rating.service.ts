import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Star } from '../models/rating.model';
import { CafeComments } from '../models/comments.model';
import { map } from 'rxjs/operators';

@Injectable()
export class RatingService {
  constructor(private _afs: AngularFirestore) {}

  getCafeComments(cafeId) {
    return this._afs
      .collection('comments', ref => {
        let query: any = ref;
        query = query.where('cafeId', '==', cafeId);
        query = query.orderBy('date', 'desc');
        return query;
      })
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as CafeComments;
            return data;
          });
        })
      );
  }

  postComments(comment: CafeComments, cafeId) {
   return this._afs.collection('comments').add({
      username: comment.username,
      comment: comment.comment,
      cafeId: cafeId,
      date: new Date().toLocaleString()
    }).then(docRef=>{
      this._afs.collection('comments').doc(docRef.id).update({ commentId: docRef.id });
    })
  }

  romoveComment(commentId){
    this._afs.collection('comments').doc(commentId).delete();
  }

  postRating(starObj: Star) {
    const starPath = `stars/${starObj.userId}_${starObj.cafeId}`;
    return this._afs.doc(starPath).set(starObj);
  }

  getCafeRating(cafeId) {
    const starsRef = this._afs.collection('stars', ref =>
      ref.where('cafeId', '==', cafeId)
    );
    return starsRef.valueChanges();
  }

  setCafeRating(cafeId, avRating: number) {
    return this._afs.doc(`cafes/${cafeId}`).update({ avRating: avRating });
  }
}
