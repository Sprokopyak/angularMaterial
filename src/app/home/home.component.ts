import { Component, OnInit } from '@angular/core';
import { CafeService } from '../core/cafe-service/cafe.service';

import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { InfinityScrollService } from '../core/infinity-scroll/infinity-scroll.service';
import { CAFE_TYPES } from './../cafe/constants';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
    public infinityScrollService: InfinityScrollService
  ) {}

  search($event) {
    let query = $event.target.value;
    if (query !== '') {
      this.startAt.next(query);
      this.endAt.next(query + '\uf8ff');
    } else {
      this.infinityScrollService.init('cafes', 'cafeName', { reverse: true, prepend: false })
    }
  }

  ngOnInit() {
    this.infinityScrollService.init('cafes', 'cafeName', { reverse: true, prepend: false })

    combineLatest( 
      this.infinityScrollService.ratingFilter$, 
      this.infinityScrollService.cafeTypeFilter$, 
      this.infinityScrollService.freeTablesFilter$
    ).subscribe(()=>
      this.infinityScrollService.filters('cafes', 'avRating')      
    )

    combineLatest(this.startAt, this.endAt).subscribe(value => {
      this.infinityScrollService.data = this._cafeService.searchCafe(value[0], value[1]);
    });
  }

  onScroll(e) {       
    if (e === 'bottom') {      
      this.infinityScrollService.more()
    }
  }

  filterByCafeType(type: string | null) {
    this.infinityScrollService.cafeTypeFilter$.next(type);
  }

  filterByRating(rating: number | null) {
    this.infinityScrollService.ratingFilter$.next(rating);
  }

  filterByFreeTables(freeTables: number | null) {
    this.infinityScrollService.freeTablesFilter$.next(freeTables);
  }
}
