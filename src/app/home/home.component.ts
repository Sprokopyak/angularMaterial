import { Component, OnInit } from '@angular/core';
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
  searchterm: string;
  selectedType: string;
  selectedRating: number;
  selectedFreeTables;

  constructor(
    public infinityScrollService: InfinityScrollService
  ) {}

  search($event) {
    let query = $event.target.value.toLowerCase();
    if (query !== '') {
      this.infinityScrollService.searchStartAt.next(query)
      this.infinityScrollService.searchEndAt.next(query + '\uf8ff')
    } else {
      this.infinityScrollService.reset()
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

    combineLatest(this.infinityScrollService.searchStartAt, this.infinityScrollService.searchEndAt).subscribe(value => {
      this.infinityScrollService.searchCafe();
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
