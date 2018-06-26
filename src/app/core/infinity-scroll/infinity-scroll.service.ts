import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap, scan } from 'rxjs/operators';

@Injectable()
export class InfinityScrollService {
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);
  query;
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  cafeTypeFilter$ = new BehaviorSubject(null);
  ratingFilter$ = new BehaviorSubject(null);
  freeTablesFilter$ = new BehaviorSubject(null);

  constructor(private _afs: AngularFirestore) {}

  init(path, field, opts?) {
    this.query = {
      path,
      field,
      limit: 6,
      reverse: false,
      prepend: false,
      ...opts
    };

    const first = this._afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    })

    this.mapAndUpdate(first);

    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  filters(path, field){
    this.reset()
 
    if (this.ratingFilter$.value){
      this.query.field =field
    }

    const first = this._afs.collection(this.query.path, ref => {
      let query: any = ref;
      if (this.cafeTypeFilter$.value) { query = query.where('cafeType', '==', this.cafeTypeFilter$.value);}
      if (this.freeTablesFilter$.value) { query = query.where('freeTables', '!=', this.freeTablesFilter$.value); }
      if (this.ratingFilter$.value) { query = query.where('avRating', '>=', this.ratingFilter$.value); }
      query = query.orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
      query = query.limit(this.query.limit)
      return query;
    })

    this.mapAndUpdate(first);

    this.data= this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  more() {    
    const cursor = this.getCursor();
    const more =  this._afs.collection(this.query.path, ref => {
      let query: any = ref;
      if (this.cafeTypeFilter$.value) { query = query.where('cafeType', '==', this.cafeTypeFilter$.value);}
      if (this.freeTablesFilter$.value) { query = query.where('freeTables', '!=', this.freeTablesFilter$.value); }
      if (this.ratingFilter$.value) { query = query.where('avRating', '>=', this.ratingFilter$.value); }
      query = query.orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
      query = query.limit(this.query.limit)
      query = query.startAfter(cursor)
      return query;
    })
    this.mapAndUpdate(more);
  }

  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend
        ? current[0].doc
        : current[current.length - 1].doc;
    }
    return null;
  }

  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    if (this._done.value || this._loading.value) {
      return;
    }

    this._loading.next(true);

    return col
      .snapshotChanges()
      .pipe(
        tap(arr => {
          let values = arr.map(snap => {
            const data = snap.payload.doc.data();
            const doc = snap.payload.doc;
            return { ...data, doc };
          });

          values = this.query.prepend ? values.reverse() : values;

          this._data.next(values);
          this._loading.next(false);

          if (!values.length) {
            this._done.next(true);
          }
        }),
        take(1)
      )
      .subscribe();
  }

  reset() {
    this._data.next([]);
    this._done.next(false);
  }
}
