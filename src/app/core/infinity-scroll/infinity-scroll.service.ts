import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { take,tap, scan } from 'rxjs/operators';


interface QueryConfig {
  path: string, 
  field: string, 
  limit?: number, 
  reverse?: boolean, 
  prepend?: boolean 
}

@Injectable()
export class InfinityScrollService {
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);
  private _query: QueryConfig;

  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor( private afs: AngularFirestore ) { }

  init(path, field, opts?) {
    this._query = { 
      path,
      field,
      limit: 4,
      reverse: false,
      prepend: false,
      ...opts
    }

    const first = this.afs.collection(this._query.path, ref => {
      return ref
              .orderBy(this._query.field, this._query.reverse ? 'desc' : 'asc')
              .limit(this._query.limit)
    })

    this.mapAndUpdate(first)

    this.data = this._data.asObservable()
      .pipe(
        scan( (acc, val) => { 
          return this._query.prepend ? val.concat(acc) : acc.concat(val)
        })
      )
  }

  more() {
    const cursor = this.getCursor()

    const more = this.afs.collection(this._query.path, ref => {
      return ref
              .orderBy(this._query.field, this._query.reverse ? 'desc' : 'asc')
              .limit(this._query.limit)
              .startAfter(cursor)
    })
    this.mapAndUpdate(more)
  }

  private getCursor() {
    const current = this._data.value
    if (current.length) {
      return this._query.prepend ? current[0].doc : current[current.length - 1].doc 
    }
    return null
  }


  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    if (this._done.value || this._loading.value) { return };

    this._loading.next(true)

    return col.snapshotChanges()
      .pipe(
            tap(arr => {              
              let values = arr.map(snap => {
                const data = snap.payload.doc.data()
                const doc = snap.payload.doc
                return { ...data, doc }
              })
        
              values = this._query.prepend ? values.reverse() : values

              this._data.next(values)
              this._loading.next(false)

              if (!values.length) {
                this._done.next(true)
              }
          }),
          take(1)
      )
      .subscribe()
  }

  reset() {
    this._data.next([])
    this._done.next(false)
  }
}