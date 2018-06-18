import { Component, OnInit } from "@angular/core";
import { CafeService } from "../core/cafe-service/cafe.service";
import { Cafe } from "../core/models/cafe.model";

import { AngularFirestore } from "angularfire2/firestore";

import { Observable, Subject, combineLatest, BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { CAFE_TYPES } from "../cafe/constants";
import { InfinityScrollService } from '../core/infinity-scroll/infinity-scroll.service';

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class Home implements OnInit {
  cafes: Observable<any>;
  startAt = new Subject();
  endAt = new Subject();
  cafeTypes = CAFE_TYPES;
  cafeTypeFilter$ = new BehaviorSubject(null);
  ratingFilter$ = new BehaviorSubject(null);
  freeTablesFilter$ = new BehaviorSubject(null);

  constructor(
    private _cafeService: CafeService,
    private afs: AngularFirestore,
    public page: InfinityScrollService
  ) {}

  search($event) {
    let query = $event.target.value;
    if (query !== "") {
      this.startAt.next(query);
      this.endAt.next(query + "\uf8ff");
    } else {
      this.cafes = this._cafeService.getCafes();
    }
  }

  ngOnInit() {
    this.page.init('cafes', 'cafeName', { reverse: true, prepend: false })

    this.cafes = this._cafeService.getCafes();

    combineLatest(this.startAt, this.endAt).subscribe(value => {
      this.cafes = this._cafeService.searchCafe(value[0], value[1]);
    });

    this.cafes = combineLatest(
      this.cafeTypeFilter$,
      this.freeTablesFilter$,
      this.ratingFilter$
    ).pipe(
      switchMap(([cafeType, freeTables, cafeRating]) =>
        this.afs
          .collection<Cafe>("cafes", ref => {
            let query: any = ref;
            if (cafeType) { query = query.where("cafeType", "==", cafeType);}
            if (freeTables) { query = query.where("freeTables", "!=", freeTables); }
            if (cafeRating) { query = query.where("avRating", ">=", cafeRating); }
            return query;
          })
          .valueChanges()
      )
    );
  }

  onScroll(e) {       
    if (e === 'bottom') {
      this.page.more()
    }
  }


  filterByCafeType(type: string | null) {
    this.page.freeTablesFilter$.next(type);
  }

  filterByRating(rating: number | null) {
    this.ratingFilter$.next(rating);
  }

  filterByFreeTables(freeTables: number | null) {
    this.freeTablesFilter$.next(freeTables);
  }

  getCafetype(type) {
    let typeName;
    this.cafeTypes.forEach(val => {
      if (val.value === type) {
        typeName = val.viewValue;
      }
    });
    return typeName;
  }
}
