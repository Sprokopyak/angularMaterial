import { Component, OnInit } from "@angular/core";
import { CafeService } from "../core/cafe-service/cafe.service";

import { Subject, combineLatest, BehaviorSubject } from "rxjs";
import { InfinityScrollService } from '../core/infinity-scroll/infinity-scroll.service';
import { CAFE_TYPES } from "./../cafe/constants";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class Home implements OnInit {
  startAt = new Subject();
  endAt = new Subject();
  cafeTypes = CAFE_TYPES;
  cafeTypeFilter$ = new BehaviorSubject(null);
  ratingFilter$ = new BehaviorSubject(null);
  freeTablesFilter$ = new BehaviorSubject(null);

  constructor(
    private _cafeService: CafeService,
    public page: InfinityScrollService
  ) {}

  search($event) {
    let query = $event.target.value;
    if (query !== "") {
      this.startAt.next(query);
      this.endAt.next(query + "\uf8ff");
    } else {
      this.page.init('cafes', 'cafeName', { reverse: true, prepend: false })
    }
  }

  ngOnInit() {
    this.page.init('cafes', 'cafeName', { reverse: true, prepend: false })

    combineLatest( this.page.ratingFilter$, this.page.cafeTypeFilter$, this.page.freeTablesFilter$).subscribe(()=>
      this.page.filters('cafes', 'avRating')      
    )

    combineLatest(this.startAt, this.endAt).subscribe(value => {
      this.page.data = this._cafeService.searchCafe(value[0], value[1]);
    });
  }

  onScroll(e) {       
    if (e === 'bottom') {      
      this.page.more()
    }
  }

  filterByCafeType(type: string | null) {
    this.page.cafeTypeFilter$.next(type);
  }

  filterByRating(rating: number | null) {
    this.page.ratingFilter$.next(rating);
  }

  filterByFreeTables(freeTables: number | null) {
    this.page.freeTablesFilter$.next(freeTables);
  }
}
