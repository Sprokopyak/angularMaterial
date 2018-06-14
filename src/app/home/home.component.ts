import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../core/auth-service/auth.service";
import { CafeService } from "../core/cafe-service/cafe.service";
import { Cafe } from "../core/models/cafe.model";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CAFE_TYPES } from "../cafe/constants";

import { MapsAPILoader } from "@agm/core";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class Home implements OnInit {
  cafes: Cafe[];
  freeTables;
  cafeTypes = CAFE_TYPES;
  private subscription;
  user: object;
  avgRating: Observable<any>;

  constructor(
    private _authService: AuthService,
    private _mapsAPILoader: MapsAPILoader,
    private _cafeService: CafeService
  ) {}

  ngOnInit() {
    this._authService.user.subscribe(val => {
      this.user = val;
    });
    this.subscription = this._cafeService.getCafes().subscribe(cafes => {
      this.cafes = cafes;
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  starHandler(val, cafeId) {
    this._cafeService.postRating({
      userId: this.user["uid"],
      cafeId: cafeId,
      ratingValue: val
    });

    this._cafeService.getCafeRating(cafeId).subscribe(retVal => {
      const ratings = retVal.map(v => v["ratingValue"]);
      let avRating = ratings.length
        ? ratings.reduce((total, val) => total + val) / retVal.length
        : 0;
      this._cafeService.setCafeRating(cafeId, avRating.toFixed(1));
    });
  }
}
