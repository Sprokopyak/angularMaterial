import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../core/auth-service/auth.service";
import { CafeService } from "../core/cafe-service/cafe.service";
import { Cafe } from "../core/models/cafe.model";

import { Observable, Subject, combineLatest } from "rxjs";
import { AngularFirestore } from 'angularfire2/firestore';
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
  freeTables;
  cafeTypes = CAFE_TYPES;

  constructor(
    private _mapsAPILoader: MapsAPILoader,
    private _cafeService: CafeService
  ) {}

  search($event) {
    let query = $event.target.value;
    if (query !== '') {
      this.startAt.next(query);
      this.endAt.next(query + "\uf8ff");
    } else {     
      this.cafes = this._cafeService.getCafes();
    }
  }
 
  ngOnInit() {
    this.cafes = this._cafeService.getCafes();

    combineLatest(this.startAt, this.endAt).subscribe((value) => { 
      this.cafes = this._cafeService.searchCafe(value[0], value[1])
    });

    this._mapsAPILoader.load();
  }

  map(cord) {
    let address;
    let latlng = new google.maps.LatLng(cord.latitude, cord.longitude);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        address = results[0].formatted_address;
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
