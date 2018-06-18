import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { switchMap, take, tap, scan, map } from "rxjs/operators";

@Injectable()
export class InfinityScrollService {query
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  freeTablesFilter$ = new BehaviorSubject(null);

  constructor(private afs: AngularFirestore) {}

  // Initial query sets options and defines the Observable
  init(path, field, opts?) {
    this.query = {
      path,
      field,
      limit: 4,
      reverse: false,
      prepend: false,
      ...opts
    };

    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? "desc" : "asc")
        .limit(this.query.limit);
    });

    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        console.log(acc, val);
        
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor();

    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? "desc" : "asc")
        .limit(this.query.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }

  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend
        ? current[0].doc
        : current[current.length - 1].doc;
    }
    return null;
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    console.log(this.freeTablesFilter$);
    
    if (this._done.value || this._loading.value) {
      return;
    }

    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col
      .snapshotChanges()
      .pipe(
        tap(arr => {
          let values = arr.map(snap => {
            const data = snap.payload.doc.data();
            const doc = snap.payload.doc;
            return { ...data, doc };
          });

          // If prepending, reverse array
          values = this.query.prepend ? values.reverse() : values;

          // update source with new values, done loading
          this._data.next(values);
          this._loading.next(false);

          // no more values, mark done
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
