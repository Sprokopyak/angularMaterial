import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../core/auth-service/auth.service";
import { CafeService } from "../core/cafe-service/cafe.service";
import { Cafe } from "../core/models/cafe.model";

import { CAFE_TYPES } from '../cafe/constants';

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

  constructor(
    private _authService: AuthService,
    private _mapsAPILoader: MapsAPILoader,
    private _cafeService: CafeService
  ) { }

  ngOnInit() {
    this.subscription = this._cafeService.getCafes().subscribe(cafes => {
      console.log(cafes);
      this.cafes = cafes;
    });

    this._mapsAPILoader.load()
  }

  map2(cord, fn) {
    let address;
    let latlng = new google.maps.LatLng(cord.latitude, cord.longitude);
    const geocoder = new google.maps.Geocoder;

    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {

        return fn(results[0].formatted_address);

      }
    })

      // return address
  }

  map(a){
    const x = this.map2(a, b =>{
      console.log(b);
      return b
    })

    return x;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  getCafetype(type) {
    let typeName;
    this.cafeTypes.forEach(val => {
      if (val.value === type) {
        typeName = val.viewValue;
      }
    })
    return typeName
  }

  getFreeTables(tables) {
    let sum = 0;
    tables.forEach(val => {
      sum += val.tablesNumber - val.booked
    });
    return sum;
  }
}