import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CafeService } from "../core/cafe-service/cafe.service";
import { Cafe } from "../core/models/cafe.model";

import { AngularFirestore } from "angularfire2/firestore";

import { Observable, Subject, combineLatest, BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { CAFE_TYPES } from "../cafe/constants";
import { MapsAPILoader } from "@agm/core";

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
    private _mapsAPILoader: MapsAPILoader,
    private _cafeService: CafeService,
    private afs: AngularFirestore
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

    this._mapsAPILoader.load();
  }

  filterByCafeType(type: string | null) {
    this.cafeTypeFilter$.next(type);
  }

  filterByRating(rating: number | null) {
    this.ratingFilter$.next(rating);
  }

  filterByFreeTables(freeTables: number | null) {
    this.freeTablesFilter$.next(freeTables);
  }

  map(cord) {
    let address;
    let latlng = new google.maps.LatLng(cord.latitude, cord.longitude);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        address = results[0].formatted_address;
        console.log(address);
      }
    });
    return address;
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

  getFreeTables(tables) {
    let sum = 0;
    tables.forEach(val => {
      sum += val.tablesNumber - val.booked;
    });
    return sum;
  }
}
